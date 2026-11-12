import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities } from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

const city: City = {
  id: '3448439',
  name: 'São Paulo',
  adminRegion: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
};

const dailyData = {
  time: ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'],
  weather_code: [1, 2, 3, 61, 0],
  temperature_2m_max: [23.1, 24, 20.5, 19.2, 22],
  temperature_2m_min: [16, 17.1, 15.4, 14.8, 16.3],
};

const currentData = {
  time: '2026-11-11T09:00',
  temperature_2m: 18.2,
  weather_code: 1,
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('searchCities', () => {
  it('retorna lista vazia sem chamar a rede para input vazio', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   \t ')).resolves.toEqual([]);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('codifica o nome e mapeia resultados para City', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 3448439,
              name: 'São Paulo',
              latitude: -23.55,
              longitude: -46.63,
              admin1: 'São Paulo',
              country: 'Brasil',
            },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('  São Paulo  ')).resolves.toEqual([
      {
        id: '3448439',
        name: 'São Paulo',
        adminRegion: 'São Paulo',
        country: 'Brasil',
        latitude: -23.55,
        longitude: -46.63,
      },
    ]);

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain(`name=${encodeURIComponent('São Paulo')}`);
    expect(requestedUrl).toContain('&language=pt&format=json');
  });

  it('codifica caracteres reservados sem alterar o termo pesquisado', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ results: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const query = "São Paulo & O'Brien #2";

    await expect(searchCities(query)).resolves.toEqual([]);

    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestedUrl.searchParams.get('name')).toBe(query);
  });

  it('preenche contexto geográfico ausente com null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            results: [{ id: 1, name: 'Cidade', latitude: 1, longitude: 2 }],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(searchCities('Cidade')).resolves.toEqual([
      {
        id: '1',
        name: 'Cidade',
        adminRegion: null,
        country: null,
        latitude: 1,
        longitude: 2,
      },
    ]);
  });

  it('normaliza contexto geográfico vazio para null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            results: [
              {
                id: 2,
                name: 'Cidade',
                latitude: 1,
                longitude: 2,
                admin1: '   ',
                country: '',
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(searchCities('Cidade')).resolves.toMatchObject([
      { adminRegion: null, country: null },
    ]);
  });

  it('retorna lista vazia quando results está ausente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({}), { status: 200 })),
    );

    await expect(searchCities('Cidade')).resolves.toEqual([]);
  });

  it('retorna lista vazia quando results é um array vazio', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [] }), { status: 200 })),
    );

    await expect(searchCities('Cidade inexistente')).resolves.toEqual([]);
  });

  it('lança WeatherServiceError quando a resposta HTTP não é ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      statusCode: 503,
    });
  });

  it('lança WeatherServiceError quando o endpoint forecast retorna HTTP 503', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      statusCode: 503,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('converte Retry-After de HTTP 429 em milissegundos', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response(null, { status: 429, headers: { 'Retry-After': '3' } })),
    );

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      statusCode: 429,
      retryAfterMs: 3_000,
    });
  });

  it('converte falha de rede em WeatherServiceError e limpa o timer', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
      statusCode: null,
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('aborta após 10 segundos e converte AbortError em timeout', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
          });
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = searchCities('São Paulo');
    const rejected = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A requisição demorou demais.',
      statusCode: null,
    });

    await vi.advanceTimersByTimeAsync(10_000);
    await rejected;

    expect(fetchMock).toHaveBeenCalledOnce();
    expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('busca e mapeia clima atual e cinco dias locais', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          timezone: 'America/Sao_Paulo',
          current: currentData,
          daily: dailyData,
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const weather = await getWeather(city);
    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);

    expect(requestedUrl.origin + requestedUrl.pathname).toBe(
      'https://api.open-meteo.com/v1/forecast',
    );
    expect(requestedUrl.searchParams.get('latitude')).toBe(String(city.latitude));
    expect(requestedUrl.searchParams.get('longitude')).toBe(String(city.longitude));
    expect(requestedUrl.searchParams.get('current')).toBe('temperature_2m,weather_code');
    expect(requestedUrl.searchParams.get('daily')).toBe(
      'weather_code,temperature_2m_max,temperature_2m_min',
    );
    expect(requestedUrl.searchParams.get('timezone')).toBe('auto');
    expect(requestedUrl.searchParams.get('forecast_days')).toBe('5');
    expect(requestedUrl.searchParams.get('temperature_unit')).toBe('celsius');
    expect(weather.city).toEqual(city);
    expect(weather.current).toEqual({
      temperatureC: 18.2,
      weatherCode: 1,
      conditionLabelPtBR: 'Predominantemente limpo',
      observedAt: '2026-11-11T09:00',
    });
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[3]).toMatchObject({
      dateLocal: '2026-11-14',
      weatherCode: 61,
      conditionLabelPtBR: 'Chuva',
      minTemperatureC: 14.8,
      maxTemperatureC: 19.2,
      availability: 'complete',
    });
  });

  it.each([
    { current: undefined, daily: dailyData },
    { current: currentData, daily: undefined },
  ])('lança WeatherServiceError se current ou daily estiver ausente', async (payload) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 })),
    );

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      statusCode: 200,
    });
  });

  it('produz cinco ForecastDay e marca arrays paralelos incompletos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'America/Sao_Paulo',
            current: currentData,
            daily: {
              time: dailyData.time,
              weather_code: [1],
              temperature_2m_max: [23.1],
              temperature_2m_min: [],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    const weather = await getWeather(city);

    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[0].availability).toBe('partial');
    expect(weather.forecast[0].minTemperatureC).toBeNull();
    expect(weather.forecast[1].availability).toBe('unavailable');
  });

  it('normaliza current parcial e invalida forecast sem timezone válido', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'Invalid/Timezone',
            current: { time: '', temperature_2m: null, weather_code: 999 },
            daily: {
              time: dailyData.time,
              weather_code: [null, null, null, null, null],
              temperature_2m_max: [null, null, null, null, null],
              temperature_2m_min: [null, null, null, null, null],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    const weather = await getWeather(city);

    expect(weather.timezone).toBeNull();
    expect(weather.current).toEqual({
      temperatureC: null,
      weatherCode: 999,
      conditionLabelPtBR: null,
      observedAt: null,
    });
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast.every((day) => day.availability === 'unavailable')).toBe(true);
    expect(weather.forecast.every((day) => day.minTemperatureC === null)).toBe(true);
    expect(weather.forecast.every((day) => day.maxTemperatureC === null)).toBe(true);
  });
});
