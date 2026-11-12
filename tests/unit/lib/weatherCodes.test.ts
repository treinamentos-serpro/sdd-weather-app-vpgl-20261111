import { describe, expect, it } from 'vitest';
import { getWeatherConditionLabel, getWeatherIcon } from '../../../src/lib/weatherCodes';

describe('weatherCodes', () => {
  it('retorna ícone e rótulo para um código conhecido', () => {
    expect(getWeatherIcon(1)).toBe('🌤️');
    expect(getWeatherConditionLabel(1)).toBe('Predominantemente limpo');
  });

  it('usa null como fallback para códigos desconhecidos ou ausentes', () => {
    expect(getWeatherIcon(999)).toBeNull();
    expect(getWeatherConditionLabel(999)).toBeNull();
    expect(getWeatherIcon(null)).toBeNull();
    expect(getWeatherConditionLabel(null)).toBeNull();
  });
});
