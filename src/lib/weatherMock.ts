import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: '3448439',
    name: 'São Paulo',
    adminRegion: 'São Paulo',
    country: 'Brasil',
    latitude: -23.55,
    longitude: -46.63,
  },
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureC: 18.2,
    weatherCode: 1,
    conditionLabelPtBR: 'Predominantemente limpo',
    observedAt: '2026-11-11T09:00',
  },
  forecast: [
    {
      dateLocal: '2026-11-11',
      weatherCode: 1,
      conditionLabelPtBR: 'Predominantemente limpo',
      minTemperatureC: 16,
      maxTemperatureC: 23.1,
      availability: 'complete',
    },
    {
      dateLocal: '2026-11-12',
      weatherCode: 2,
      conditionLabelPtBR: 'Parcialmente nublado',
      minTemperatureC: 17.1,
      maxTemperatureC: 24,
      availability: 'complete',
    },
    {
      dateLocal: '2026-11-13',
      weatherCode: 3,
      conditionLabelPtBR: 'Encoberto',
      minTemperatureC: 15.4,
      maxTemperatureC: 20.5,
      availability: 'complete',
    },
    {
      dateLocal: '2026-11-14',
      weatherCode: 61,
      conditionLabelPtBR: 'Chuva',
      minTemperatureC: 14.8,
      maxTemperatureC: 19.2,
      availability: 'complete',
    },
    {
      dateLocal: '2026-11-15',
      weatherCode: 0,
      conditionLabelPtBR: 'Céu limpo',
      minTemperatureC: 16.3,
      maxTemperatureC: 22,
      availability: 'complete',
    },
  ],
};
