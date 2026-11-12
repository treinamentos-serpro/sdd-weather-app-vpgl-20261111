import { getWeatherConditionLabel } from '../lib/weatherCodes';
import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

interface GeocodingResult {
  id: number | string;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string | null;
  country?: string | null;
}

export class WeatherServiceError extends Error {
  readonly statusCode: number | null;
  readonly retryAfterMs: number | null;

  constructor(
    statusCode: number | null,
    message = statusCode === null
      ? 'Open-Meteo request failed.'
      : `Open-Meteo request failed with status ${statusCode}.`,
    retryAfterMs: number | null = null,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
    this.statusCode = statusCode;
    this.retryAfterMs = retryAfterMs;
  }
}

function parseRetryAfter(value: string | null): number | null {
  if (value === null) {
    return null;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const retryAt = Date.parse(value);
  return Number.isNaN(retryAt) ? null : Math.max(0, retryAt - Date.now());
}

function createHttpError(response: Response): WeatherServiceError {
  if (response.status === 429) {
    const retryAfterMs = parseRetryAfter(response.headers.get('Retry-After'));
    return new WeatherServiceError(
      response.status,
      'Limite de consultas atingido. Tente novamente em instantes.',
      retryAfterMs,
    );
  }

  if (response.status >= 500) {
    return new WeatherServiceError(
      response.status,
      'Serviço de clima indisponível. Tente novamente.',
    );
  }

  return new WeatherServiceError(
    response.status,
    'A solicitação de clima não pôde ser processada.',
  );
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    const isAbortError =
      typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError';

    if (isAbortError) {
      throw new WeatherServiceError(null, 'A requisição demorou demais.');
    }

    throw new WeatherServiceError(null, 'Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nullableString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function validTimeZone(value: unknown): string | null {
  const timezone = nullableString(value);
  if (timezone === null) {
    return null;
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return timezone;
  } catch {
    return null;
  }
}

function isGeocodingResult(value: unknown): value is GeocodingResult {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (typeof value.id === 'number' || typeof value.id === 'string') &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.latitude === 'number' &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === 'number' &&
    Number.isFinite(value.longitude) &&
    (value.admin1 === undefined || value.admin1 === null || typeof value.admin1 === 'string') &&
    (value.country === undefined || value.country === null || typeof value.country === 'string')
  );
}

function isValidLocalDate(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function nullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function numberAt(values: unknown, index: number): number | null {
  return Array.isArray(values) ? nullableNumber(values[index]) : null;
}

function availabilityForDay(
  weatherCode: number | null,
  minTemperatureC: number | null,
  maxTemperatureC: number | null,
): ForecastDay['availability'] {
  const presentFields = [weatherCode, minTemperatureC, maxTemperatureC].filter(
    (value) => value !== null,
  ).length;

  if (presentFields === 3) {
    return 'complete';
  }
  return presentFields === 0 ? 'unavailable' : 'partial';
}

export async function searchCities(name: string): Promise<City[]> {
  const normalizedName = name.trim();
  if (normalizedName.length === 0) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(normalizedName)}&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw createHttpError(response);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload)) {
    throw new WeatherServiceError(response.status, 'Resposta de busca inválida.');
  }
  if (payload.results === undefined) {
    return [];
  }
  if (!Array.isArray(payload.results)) {
    throw new WeatherServiceError(response.status, 'Resposta de busca inválida.');
  }

  return payload.results.filter(isGeocodingResult).map((result) => ({
    id: String(result.id),
    name: result.name.trim(),
    adminRegion: nullableString(result.admin1),
    country: nullableString(result.country),
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '5',
    temperature_unit: 'celsius',
  });
  const response = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw createHttpError(response);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new WeatherServiceError(
      response.status,
      'Open-Meteo forecast response is missing current or daily data.',
    );
  }

  const currentPayload = payload.current;
  const dailyPayload = payload.daily;
  const dailyDates = Array.isArray(dailyPayload.time) ? dailyPayload.time.slice(0, 5) : [];
  if (dailyDates.length !== 5 || !dailyDates.every(isValidLocalDate)) {
    throw new WeatherServiceError(
      response.status,
      'Open-Meteo forecast response must contain five valid daily dates.',
    );
  }

  const timezone = validTimeZone(payload.timezone);
  const currentCode = nullableNumber(currentPayload.weather_code);
  const current: CurrentWeather = {
    temperatureC: nullableNumber(currentPayload.temperature_2m),
    weatherCode: currentCode,
    conditionLabelPtBR: getWeatherConditionLabel(currentCode),
    observedAt: timezone ? nullableString(currentPayload.time) : null,
  };

  const forecast: ForecastDay[] = dailyDates.map((dateLocal, index) => {
    const weatherCode = nullableNumber(numberAt(dailyPayload.weather_code, index));
    const minTemperatureC = nullableNumber(numberAt(dailyPayload.temperature_2m_min, index));
    const maxTemperatureC = nullableNumber(numberAt(dailyPayload.temperature_2m_max, index));
    const isTimezoneAvailable = timezone !== null;

    return {
      dateLocal,
      weatherCode: isTimezoneAvailable ? weatherCode : null,
      conditionLabelPtBR: isTimezoneAvailable ? getWeatherConditionLabel(weatherCode) : null,
      minTemperatureC: isTimezoneAvailable ? minTemperatureC : null,
      maxTemperatureC: isTimezoneAvailable ? maxTemperatureC : null,
      availability: isTimezoneAvailable
        ? availabilityForDay(weatherCode, minTemperatureC, maxTemperatureC)
        : 'unavailable',
    };
  });

  return { city, timezone, current, forecast };
}
