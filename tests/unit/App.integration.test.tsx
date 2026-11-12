import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import ErrorState from '../../src/components/states/ErrorState';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City, WeatherData } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/services/weatherService')>();
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

afterEach(cleanup);
afterEach(() => vi.resetAllMocks());

describe('Weather App', () => {
  it('exibe o estado vazio inicial', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeTruthy();
  });

  it('anuncia o carregamento e mostra estado vazio sem cidades', async () => {
    const user = userEvent.setup();
    let resolveSearch: ((cities: City[]) => void) | undefined;
    mockedSearchCities.mockImplementation(
      () => new Promise((resolve) => (resolveSearch = resolve)),
    );
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('status').textContent).toContain('Buscando Lisboa');
    expect(screen.getByRole('search', { name: 'Buscar cidade' }).getAttribute('aria-busy')).toBe(
      'true',
    );
    await act(async () => resolveSearch?.([]));
    const emptyHeading = await screen.findByRole('heading', {
      name: 'Nenhuma cidade encontrada',
    });
    expect(emptyHeading).toBeTruthy();
    expect(document.activeElement).toBe(emptyHeading);
    expect(mockedGetWeather).not.toHaveBeenCalled();
  });

  it('exibe resultados para seleção e deriva Fahrenheit sem nova busca', async () => {
    const user = userEvent.setup();
    mockedSearchCities.mockResolvedValue([city]);
    mockedGetWeather.mockResolvedValue(weatherData);
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('heading', { name: 'Selecione uma cidade' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'São Paulo, São Paulo, Brasil' })).toBeTruthy();
    expect(mockedGetWeather).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'São Paulo, São Paulo, Brasil' }));

    const cityHeading = await screen.findByRole('heading', { name: 'São Paulo' });
    expect(cityHeading).toBeTruthy();
    expect(document.activeElement).toBe(cityHeading);
    expect(screen.getByText('18.2°C')).toBeTruthy();
    expect(mockedGetWeather).toHaveBeenCalledWith(city);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('64.8°F')).toBeTruthy();
  });

  it('invoca a nova tentativa pelo estado de erro', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorState message="Falha ao carregar" onRetry={onRetry} />);

    expect(screen.getByRole('alert').textContent).toContain('Falha ao carregar');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('conecta o botão de retry do estado de erro ao hook', async () => {
    const user = userEvent.setup();
    mockedSearchCities.mockResolvedValue([city]);
    mockedGetWeather
      .mockRejectedValueOnce(new WeatherServiceError(null, 'Falha de rede.'))
      .mockResolvedValueOnce(weatherData);
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.click(await screen.findByRole('button', { name: 'São Paulo, São Paulo, Brasil' }));
    expect(await screen.findByRole('alert')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeTruthy();
    expect(mockedGetWeather).toHaveBeenCalledTimes(2);
  });

  it('não apresenta botão de retry para erro HTTP permanente', async () => {
    const user = userEvent.setup();
    mockedSearchCities.mockResolvedValue([city]);
    mockedGetWeather.mockRejectedValue(new WeatherServiceError(400, 'Requisição inválida.'));
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.click(await screen.findByRole('button', { name: 'São Paulo, São Paulo, Brasil' }));

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull();
  });
});
