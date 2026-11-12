import type { Ref } from 'react';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
  titleRef?: Ref<HTMLHeadingElement>;
}

export default function CurrentWeather({ city, current, unit, titleRef }: CurrentWeatherProps) {
  const temperature = formatTemperature(current.temperatureC, unit);
  const weatherIcon = getWeatherIcon(current.weatherCode);
  const cityName = city.name.trim() || 'Cidade indisponível';
  const locationContext = [city.adminRegion, city.country]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(', ');
  const condition = current.conditionLabelPtBR?.trim() || 'Condição indisponível';
  const observedAt = current.observedAt?.trim();

  return (
    <section
      aria-labelledby="current-weather-title"
      className="rounded-lg border border-white/10 bg-white/5 p-6 text-white shadow-glass backdrop-blur-md"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-400"
            id="current-weather-title"
            ref={titleRef}
            tabIndex={-1}
          >
            {cityName}
          </h2>
          {locationContext && <p className="mt-1 text-sm text-white/65">{locationContext}</p>}
        </div>
        {weatherIcon && (
          <span aria-hidden="true" className="text-5xl leading-none">
            {weatherIcon}
          </span>
        )}
      </header>

      <div className="mt-6">
        <p className="text-sm font-medium text-white/70">Clima atual</p>
        <p className="mt-1 text-5xl font-semibold leading-none tracking-tight sm:text-6xl md:text-7xl">
          {temperature}
        </p>
        <p className="mt-3 text-lg text-white/90">{condition}</p>
        <p className="mt-2 text-sm text-white/60">
          {observedAt
            ? `Observado às ${observedAt} (horário local)`
            : 'Horário da observação indisponível'}
        </p>
      </div>
    </section>
  );
}
