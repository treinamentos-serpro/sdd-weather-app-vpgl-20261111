const WEATHER_ICONS: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '❄️',
  75: '❄️',
  77: '🌨️',
  80: '🌦️',
  81: '🌧️',
  82: '🌧️',
  85: '🌨️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

const WEATHER_LABELS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Encoberto',
  45: 'Neblina',
  48: 'Neblina',
  51: 'Garoa',
  53: 'Garoa',
  55: 'Garoa',
  56: 'Garoa congelante',
  57: 'Garoa congelante',
  61: 'Chuva',
  63: 'Chuva',
  65: 'Chuva',
  66: 'Chuva congelante',
  67: 'Chuva congelante',
  71: 'Neve',
  73: 'Neve',
  75: 'Neve',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva',
  81: 'Pancadas de chuva',
  82: 'Pancadas de chuva',
  85: 'Pancadas de neve',
  86: 'Pancadas de neve',
  95: 'Trovoada',
  96: 'Trovoada com granizo',
  99: 'Trovoada com granizo',
};

export function getWeatherConditionLabel(weatherCode: number | null): string | null {
  if (weatherCode === null) {
    return null;
  }

  return WEATHER_LABELS[weatherCode] ?? null;
}

export function getWeatherIcon(weatherCode: number | null): string | null {
  if (weatherCode === null) {
    return null;
  }

  return WEATHER_ICONS[weatherCode] ?? null;
}
