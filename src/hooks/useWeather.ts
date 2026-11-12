import { useEffect, useReducer, useRef } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  canRetry: boolean;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

interface WeatherState {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  canRetry: boolean;
}

type WeatherAction =
  | { type: 'searchStarted'; query: string }
  | { type: 'searchResolved'; cities: City[] }
  | { type: 'searchEmpty' }
  | { type: 'weatherStarted' }
  | { type: 'weatherResolved'; data: WeatherData }
  | { type: 'failed'; message: string; canRetry: boolean }
  | { type: 'retryAvailable' }
  | { type: 'invalidSearch' };

type LastOperation = { type: 'search'; name: string } | { type: 'weather'; city: City };

const initialState: WeatherState = {
  status: 'idle',
  data: null,
  cities: [],
  error: null,
  query: '',
  canRetry: false,
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'searchStarted':
      return {
        status: 'loading',
        data: null,
        cities: [],
        error: null,
        query: action.query,
        canRetry: false,
      };
    case 'searchResolved':
      return { ...state, cities: action.cities };
    case 'searchEmpty':
      return { ...state, status: 'empty', data: null, cities: [], error: null, canRetry: false };
    case 'weatherStarted':
      return { ...state, status: 'loading', data: null, error: null, canRetry: false };
    case 'weatherResolved':
      return { ...state, status: 'success', data: action.data, error: null, canRetry: false };
    case 'failed':
      return {
        ...state,
        status: 'error',
        data: null,
        error: action.message,
        canRetry: action.canRetry,
      };
    case 'retryAvailable':
      return { ...state, canRetry: true };
    case 'invalidSearch':
      return {
        ...state,
        status: 'idle',
        data: null,
        cities: [],
        error: 'Informe o nome de uma cidade.',
        query: '',
        canRetry: false,
      };
  }
}

interface ErrorDetails {
  message: string;
  retryable: boolean;
  retryAfterMs: number | null;
}

function getErrorDetails(error: unknown): ErrorDetails {
  if (!(error instanceof WeatherServiceError)) {
    return {
      message: 'Não foi possível processar os dados de clima.',
      retryable: false,
      retryAfterMs: null,
    };
  }

  if (error.statusCode === null) {
    return { message: error.message, retryable: true, retryAfterMs: null };
  }

  if (error.statusCode === 429) {
    return {
      message:
        error.retryAfterMs !== null && error.retryAfterMs > 0
          ? `Limite de consultas atingido. Tente novamente em ${Math.ceil(error.retryAfterMs / 1000)} s.`
          : error.message,
      retryable: true,
      retryAfterMs: error.retryAfterMs,
    };
  }

  if (error.statusCode >= 500) {
    return { message: error.message, retryable: true, retryAfterMs: null };
  }

  if (error.statusCode >= 400) {
    return { message: error.message, retryable: false, retryAfterMs: null };
  }

  return {
    message: 'Não foi possível processar os dados de clima.',
    retryable: false,
    retryAfterMs: null,
  };
}

export default function useWeather(): UseWeatherResult {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const operationId = useRef(0);
  const lastOperation = useRef<LastOperation | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearRetryTimer() {
    if (retryTimer.current !== null) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (retryTimer.current !== null) {
        clearTimeout(retryTimer.current);
      }
    };
  }, []);

  function handleFailure(error: unknown) {
    const details = getErrorDetails(error);
    const retryDelay = details.retryAfterMs ?? 0;
    dispatch({
      type: 'failed',
      message: details.message,
      canRetry: details.retryable && retryDelay <= 0,
    });

    if (details.retryable && retryDelay > 0) {
      retryTimer.current = setTimeout(() => {
        retryTimer.current = null;
        dispatch({ type: 'retryAvailable' });
      }, retryDelay);
    }
  }

  async function loadWeather(city: City): Promise<void> {
    clearRetryTimer();
    const currentOperationId = ++operationId.current;
    lastOperation.current = { type: 'weather', city };
    dispatch({ type: 'weatherStarted' });

    try {
      const data = await getWeather(city);
      if (currentOperationId !== operationId.current) {
        return;
      }
      dispatch({ type: 'weatherResolved', data });
    } catch (error) {
      if (currentOperationId !== operationId.current) {
        return;
      }
      handleFailure(error);
    }
  }

  async function search(name: string): Promise<void> {
    const normalizedName = name.trim();
    if (normalizedName.length === 0) {
      clearRetryTimer();
      operationId.current += 1;
      lastOperation.current = null;
      dispatch({ type: 'invalidSearch' });
      return;
    }

    clearRetryTimer();
    const currentOperationId = ++operationId.current;
    lastOperation.current = { type: 'search', name: normalizedName };
    dispatch({ type: 'searchStarted', query: normalizedName });

    try {
      const cities = await searchCities(normalizedName);
      if (currentOperationId !== operationId.current) {
        return;
      }
      if (cities.length === 0) {
        lastOperation.current = null;
        dispatch({ type: 'searchEmpty' });
        return;
      }

      dispatch({ type: 'searchResolved', cities });
      await loadWeather(cities[0]);
    } catch (error) {
      if (currentOperationId !== operationId.current) {
        return;
      }
      handleFailure(error);
    }
  }

  async function retry(): Promise<void> {
    if (!state.canRetry || lastOperation.current === null) {
      return;
    }

    const operation = lastOperation.current;
    if (operation.type === 'search') {
      await search(operation.name);
      return;
    }

    await loadWeather(operation.city);
  }

  return {
    ...state,
    search,
    selectCity: loadWeather,
    retry,
  };
}
