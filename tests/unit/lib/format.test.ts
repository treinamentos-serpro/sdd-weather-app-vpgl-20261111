import { describe, expect, it } from 'vitest';
import { formatForecastDayLabel, getShortDate } from '../../../src/lib/format';

describe('formatForecastDayLabel', () => {
  it('usa Hoje e Amanhã para os dois primeiros índices', () => {
    expect(formatForecastDayLabel('2026-11-11', 0)).toBe('Hoje');
    expect(formatForecastDayLabel('2026-11-12', 1)).toBe('Amanhã');
  });

  it('usa o dia da semana para os demais índices', () => {
    expect(formatForecastDayLabel('2026-11-13', 2)).toBe('sexta-feira');
  });

  it('usa um fallback seguro quando o formato de entrada é inválido', () => {
    expect(formatForecastDayLabel('data-inválida', 2)).toBe('—');
  });
});

describe('getShortDate', () => {
  it('formata a data local sem deslocamento de fuso', () => {
    expect(getShortDate('2026-11-14')).toBe('14 de nov.');
  });

  it('usa um fallback seguro quando a data é inválida', () => {
    expect(getShortDate('2026-02-31')).toBe('—');
  });
});
