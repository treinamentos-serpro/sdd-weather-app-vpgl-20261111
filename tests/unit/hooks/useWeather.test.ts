import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useWeather from '../../../src/hooks/useWeather';
import {
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City, WeatherData } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/services/weatherService')>();
  return {
    ...actual,
    getWeather: vi.fn(),
    searchCities: vi.fn(),
  };
});

const city: City = {
  id: '3448439',
  name: 'São Paulo',
  adminRegion: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
};

const weatherData: WeatherData = {
  city,
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureC: 18.2,
    weatherCode: 1,
    conditionLabelPtBR: 'Predominantemente limpo',
    observedAt: '2026-11-11T09:00',
  },
  forecast: [],
};

const mockedSearchCities = vi.mocked(searchCities);
const mockedGetWeather = vi.mocked(getWeather);

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe('useWeather', () => {
  it('mantém idle e não consulta para nome vazio', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBe('Informe o nome de uma cidade.');
    expect(mockedSearchCities).not.toHaveBeenCalled();
  });

  it('entra em empty quando a busca não encontra cidades', async () => {
    mockedSearchCities.mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Cidade inexistente');
    });

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(mockedGetWeather).not.toHaveBeenCalled();
  });

  it('carrega o clima da primeira cidade retornada', async () => {
    mockedSearchCities.mockResolvedValue([city, { ...city, id: '2', name: 'Outra cidade' }]);
    mockedGetWeather.mockResolvedValue(weatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search(' São Paulo ');
    });

    expect(mockedSearchCities).toHaveBeenCalledWith('São Paulo');
    expect(mockedGetWeather).toHaveBeenCalledWith(city);
    expect(result.current.status).toBe('success');
    expect(result.current.cities).toHaveLength(2);
    expect(result.current.data).toEqual(weatherData);
  });

  it('retry refaz a última operação recuperável', async () => {
    mockedSearchCities.mockResolvedValue([city]);
    mockedGetWeather
      .mockRejectedValueOnce(new WeatherServiceError(null, 'Falha de rede.'))
      .mockResolvedValueOnce(weatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Falha de rede.');
    expect(result.current.canRetry).toBe(true);

    await act(async () => {
      await result.current.retry();
    });

    expect(mockedGetWeather).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(weatherData);
  });

  it('mantém retry indisponível até expirar Retry-After', async () => {
    vi.useFakeTimers();
    mockedSearchCities.mockResolvedValue([city]);
    mockedGetWeather
      .mockRejectedValueOnce(new WeatherServiceError(429, 'Limite de consultas.', 2_000))
      .mockResolvedValueOnce(weatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Limite de consultas atingido. Tente novamente em 2 s.');
    expect(result.current.canRetry).toBe(false);

    await act(async () => {
      await result.current.retry();
    });
    expect(mockedGetWeather).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });
    expect(result.current.canRetry).toBe(true);

    await act(async () => {
      await result.current.retry();
    });
    expect(mockedGetWeather).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
  });

  it('não habilita retry para erro HTTP permanente', async () => {
    mockedSearchCities.mockResolvedValue([city]);
    mockedGetWeather.mockRejectedValue(new WeatherServiceError(400, 'Requisição inválida.'));
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Requisição inválida.');
    expect(result.current.canRetry).toBe(false);
  });
});
