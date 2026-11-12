import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
      role="group"
    >
      <button
        aria-label="Celsius"
        aria-pressed={unit === 'celsius'}
        className={`min-w-12 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 ${
          unit === 'celsius'
            ? 'bg-accent-600 text-white'
            : 'text-white/75 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onChange('celsius')}
        type="button"
      >
        °C
      </button>
      <button
        aria-label="Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
        className={`min-w-12 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 ${
          unit === 'fahrenheit'
            ? 'bg-accent-600 text-white'
            : 'text-white/75 hover:bg-white/10 hover:text-white'
        }`}
        onClick={() => onChange('fahrenheit')}
        type="button"
      >
        °F
      </button>
    </div>
  );
}
