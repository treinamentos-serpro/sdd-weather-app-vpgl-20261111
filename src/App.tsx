import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import LocationResults from './components/LocationResults';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import useWeather from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const weather = useWeather();
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (
      weather.status === 'selecting' ||
      weather.status === 'success' ||
      weather.status === 'empty'
    ) {
      resultHeadingRef.current?.focus();
    }
  }, [weather.status]);

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-800/70">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-5 px-4 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6 lg:px-8">
          <a aria-label="Weather App" className="flex items-center gap-3" href="/">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5 font-bold text-accent-400"
            >
              W
            </span>
            <h1 className="text-xl font-semibold">Weather</h1>
          </a>

          <SearchBar
            disabled={weather.status === 'loading'}
            onSearch={(city) => void weather.search(city)}
          />
          <UnitToggle onChange={setUnit} unit={unit} />
        </div>
      </header>

      <main aria-label="Clima da cidade" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {weather.status === 'idle' && (
          <EmptyState
            hint={weather.error ?? 'Digite o nome de uma cidade para consultar o clima.'}
            titleRef={resultHeadingRef}
            title="Busque uma cidade"
          />
        )}

        {weather.status === 'loading' && <LoadingState message={`Buscando ${weather.query}...`} />}

        {weather.status === 'selecting' && (
          <LocationResults
            cities={weather.cities}
            onSelect={(city) => void weather.selectCity(city)}
            titleRef={resultHeadingRef}
          />
        )}

        {weather.status === 'empty' && (
          <EmptyState
            hint="Confira o nome e tente buscar outra cidade."
            titleRef={resultHeadingRef}
            title="Nenhuma cidade encontrada"
          />
        )}

        {weather.status === 'error' && (
          <ErrorState
            message={weather.error ?? 'Não foi possível consultar o clima.'}
            onRetry={weather.canRetry ? () => void weather.retry() : undefined}
          />
        )}

        {weather.status === 'success' && weather.data !== null && (
          <div className="grid gap-6">
            <CurrentWeather
              city={weather.data.city}
              current={weather.data.current}
              titleRef={resultHeadingRef}
              unit={unit}
            />
            <ForecastList forecast={weather.data.forecast} unit={unit} />
          </div>
        )}
      </main>
    </div>
  );
}
