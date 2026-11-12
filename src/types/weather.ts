export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: string;
  name: string;
  adminRegion: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  conditionLabelPtBR: string | null;
  observedAt: string | null;
}

export type ForecastAvailability = 'complete' | 'partial' | 'unavailable';

export interface ForecastDay {
  dateLocal: string;
  weatherCode: number | null;
  conditionLabelPtBR: string | null;
  minTemperatureC: number | null;
  maxTemperatureC: number | null;
  availability: ForecastAvailability;
}

export interface WeatherData {
  city: City;
  timezone: string | null;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export type QueryState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'empty'; data: null; error: null }
  | { status: 'error'; data: null; error: AppError };

export type AppErrorKind = 'network' | 'timeout' | 'http' | 'invalid-response';

export interface AppError {
  kind: AppErrorKind;
  message: string;
  httpStatus?: number;
  retryable: boolean;
  retryAfterMs?: number;
}

export interface WeatherService {
  searchLocations(query: string, signal: AbortSignal): Promise<City[]>;
  getWeather(city: City, signal: AbortSignal): Promise<WeatherData>;
}
