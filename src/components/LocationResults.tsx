import type { Ref } from 'react';
import type { City } from '../types/weather';

interface LocationResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
  titleRef?: Ref<HTMLHeadingElement>;
}

export default function LocationResults({ cities, onSelect, titleRef }: LocationResultsProps) {
  return (
    <section
      aria-labelledby="location-results-title"
      className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md"
    >
      <h2
        className="text-xl font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-400"
        id="location-results-title"
        ref={titleRef}
        tabIndex={-1}
      >
        Selecione uma cidade
      </h2>
      <ul aria-label="Resultados da busca" className="mt-4 grid gap-3">
        {cities.map((city) => {
          const locationContext = [city.adminRegion, city.country]
            .map((value) => value?.trim())
            .filter(Boolean)
            .join(', ');
          const coordinates = `${city.latitude.toFixed(2)}, ${city.longitude.toFixed(2)}`;
          const context = locationContext || coordinates;

          return (
            <li key={city.id}>
              <button
                aria-label={`${city.name}, ${context}`}
                className="flex w-full flex-col items-start rounded-lg border border-white/10 bg-night-900/50 px-4 py-3 text-left transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
                onClick={() => onSelect(city)}
                type="button"
              >
                <span className="font-semibold">{city.name}</span>
                <span className="text-sm text-white/70">{context}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
