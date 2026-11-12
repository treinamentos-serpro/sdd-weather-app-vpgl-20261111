import type { Unit } from '../types/weather';

export function convertTemperature(temperatureC: number, unit: Unit): number {
  return unit === 'fahrenheit' ? (temperatureC * 9) / 5 + 32 : temperatureC;
}

export function unitLabel(unit: Unit): '°C' | '°F' {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function formatTemperature(temperatureC: number | null, unit: Unit): string {
  if (temperatureC === null || !Number.isFinite(temperatureC)) {
    return '—';
  }

  return `${convertTemperature(temperatureC, unit).toFixed(1)}${unitLabel(unit)}`;
}
