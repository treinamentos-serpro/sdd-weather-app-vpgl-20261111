import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import ForecastList from '../../../src/components/ForecastList';
import type {
  City,
  CurrentWeather as CurrentWeatherData,
  ForecastDay,
} from '../../../src/types/weather';

const city: City = {
  id: '1',
  name: 'Cidade de exemplo',
  adminRegion: null,
  country: null,
  latitude: 0,
  longitude: 0,
};

afterEach(cleanup);

describe('fallbacks de clima ausente', () => {
  it('mostra fallbacks seguros para current parcial', () => {
    const current: CurrentWeatherData = {
      temperatureC: null,
      weatherCode: null,
      conditionLabelPtBR: null,
      observedAt: null,
    };

    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    expect(screen.getByText('—')).toBeTruthy();
    expect(screen.getByText('Condição indisponível')).toBeTruthy();
    expect(screen.getByText('Horário da observação indisponível')).toBeTruthy();
    expect(screen.queryByText(/NaN|undefined|null/)).toBeNull();
  });

  it('mostra fallbacks seguros em forecast sem valores ou condição', () => {
    const forecast: ForecastDay[] = [
      {
        dateLocal: '2026-11-11',
        weatherCode: null,
        conditionLabelPtBR: null,
        minTemperatureC: null,
        maxTemperatureC: null,
        availability: 'unavailable',
      },
    ];

    render(<ForecastList forecast={forecast} unit="fahrenheit" />);

    expect(screen.getByText('Hoje')).toBeTruthy();
    expect(screen.getByText('Condição indisponível')).toBeTruthy();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(screen.queryByText(/NaN|undefined|null/)).toBeNull();
  });
});
