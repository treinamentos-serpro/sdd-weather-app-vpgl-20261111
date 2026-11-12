import { formatForecastDayLabel, getShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const dayLabel = formatForecastDayLabel(day.dateLocal, index);
  const shortDate = getShortDate(day.dateLocal);
  const condition = day.conditionLabelPtBR?.trim() || 'Condição indisponível';
  const weatherIcon = getWeatherIcon(day.weatherCode);

  return (
    <article
      aria-label={`${dayLabel}, ${shortDate}: ${condition}`}
      className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-4 text-white shadow-glass backdrop-blur-md"
    >
      <h3 className="text-sm font-semibold text-white/85">{dayLabel}</h3>
      <p className="mt-1 text-xs text-white/70">{shortDate}</p>
      {weatherIcon && (
        <span aria-hidden="true" className="mt-4 block text-4xl leading-none">
          {weatherIcon}
        </span>
      )}
      <p className="mt-3 min-h-10 text-sm text-white/70">{condition}</p>
      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-white/70">Máx.</dt>
          <dd className="mt-1 font-semibold">{formatTemperature(day.maxTemperatureC, unit)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-white/70">Mín.</dt>
          <dd className="mt-1 font-semibold">{formatTemperature(day.minTemperatureC, unit)}</dd>
        </div>
      </dl>
    </article>
  );
}
