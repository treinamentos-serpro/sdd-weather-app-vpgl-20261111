function parseLocalDate(dateLocal: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateLocal);
  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function formatForecastDayLabel(dateLocal: string, index: number): string {
  if (index === 0) {
    return 'Hoje';
  }
  if (index === 1) {
    return 'Amanhã';
  }

  const date = parseLocalDate(dateLocal);
  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    weekday: 'long',
  }).format(date);
}

export function getShortDate(dateLocal: string): string {
  const date = parseLocalDate(dateLocal);
  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}
