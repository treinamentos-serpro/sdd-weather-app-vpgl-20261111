import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import ForecastList from '../../../src/components/ForecastList';
import UnitToggle from '../../../src/components/UnitToggle';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../../../src/types/weather';

const city: City = {
  id: '3448439',
  name: 'São Paulo',
  adminRegion: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
};

const current: CurrentWeatherData = {
  temperatureC: 0,
  weatherCode: 0,
  conditionLabelPtBR: 'Céu limpo',
  observedAt: '2026-11-11T09:00',
};

const forecast = [
  {
    dateLocal: '2026-11-11',
    weatherCode: 0,
    conditionLabelPtBR: 'Céu limpo',
    minTemperatureC: -40,
    maxTemperatureC: 100,
    availability: 'complete' as const,
  },
  {
    dateLocal: '2026-11-12',
    weatherCode: 1,
    conditionLabelPtBR: 'Predominantemente limpo',
    minTemperatureC: 10,
    maxTemperatureC: 20,
    availability: 'complete' as const,
  },
];

function UnitToggleWeatherHarness() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <>
      <UnitToggle onChange={setUnit} unit={unit} />
      <CurrentWeather city={city} current={current} unit={unit} />
      <ForecastList forecast={forecast} unit={unit} />
    </>
  );
}

afterEach(cleanup);

describe('UnitToggle com CurrentWeather', () => {
  it('converte 0°C para 32°F ao selecionar Fahrenheit', async () => {
    const user = userEvent.setup();
    render(<UnitToggleWeatherHarness />);

    expect(screen.getByText('0.0°C')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('32.0°F')).toBeTruthy();
    expect(screen.getByText('-40.0°F')).toBeTruthy();
    expect(screen.getByText('212.0°F')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Fahrenheit' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('mantém temperatura disponível e identifica campos atuais ausentes', () => {
    render(
      <CurrentWeather
        city={city}
        current={{
          temperatureC: 6.5,
          weatherCode: null,
          conditionLabelPtBR: null,
          observedAt: null,
        }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('6.5°C')).toBeTruthy();
    expect(screen.getByText('Condição indisponível')).toBeTruthy();
    expect(screen.getByText('Horário da observação indisponível')).toBeTruthy();
  });
});
