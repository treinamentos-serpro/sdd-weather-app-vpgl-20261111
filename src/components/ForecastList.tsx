import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-title" className="w-full">
      <h2 className="text-lg font-semibold text-white" id="forecast-title">
        Previsão de 5 dias
      </h2>
      {forecast.length === 0 ? (
        <p className="mt-4 text-sm text-white/70" role="status">
          Previsão indisponível.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {forecast.map((day, index) => (
            <ForecastCard day={day} index={index} key={day.dateLocal} unit={unit} />
          ))}
        </div>
      )}
    </section>
  );
}
