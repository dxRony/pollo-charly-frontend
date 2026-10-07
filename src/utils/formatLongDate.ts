export function formatLongDate(date: Date): string {
  const text = new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)

  return text.charAt(0).toUpperCase() + text.slice(1)
}
