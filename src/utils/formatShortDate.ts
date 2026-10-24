/** Convierte "2026-10-24" en una fecha local, evitando el desfase de zona horaria de `new Date(iso)`. */
export function parseDay(day: string): Date {
  const [year, month, date] = day.split('-').map(Number)

  return new Date(year, month - 1, date)
}

/** "2026-10-24" → "24 oct". */
export function formatShortDate(day: string): string {
  return new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'short' })
    .format(parseDay(day))
    .replace('.', '')
}

/** "2026-10-24" → "sáb, 24 de octubre de 2026". */
export function formatFullDate(day: string): string {
  return new Intl.DateTimeFormat('es-GT', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(parseDay(day))
    .replace('.', '')
}
