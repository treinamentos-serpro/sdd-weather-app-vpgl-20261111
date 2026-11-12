import { describe, expect, it } from 'vitest';
import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it('converte os pontos de referência Celsius para Fahrenheit', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32);
    expect(convertTemperature(100, 'fahrenheit')).toBe(212);
    expect(convertTemperature(-40, 'fahrenheit')).toBe(-40);
  });

  it('mantém Celsius e converte Fahrenheit usando a unidade recebida', () => {
    expect(convertTemperature(18.2, 'celsius')).toBe(18.2);
    expect(convertTemperature(18.2, 'fahrenheit')).toBeCloseTo(64.76);
  });
});

describe('formatTemperature', () => {
  it('arredonda para uma casa decimal e inclui o símbolo da unidade', () => {
    expect(formatTemperature(18.26, 'celsius')).toBe('18.3°C');
    expect(formatTemperature(18.2, 'fahrenheit')).toBe('64.8°F');
  });

  it('mostra traço para temperatura ausente ou não finita', () => {
    expect(formatTemperature(null, 'celsius')).toBe('—');
    expect(formatTemperature(Number.NaN, 'fahrenheit')).toBe('—');
  });
});

describe('unitLabel', () => {
  it('retorna o símbolo da unidade selecionada', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
