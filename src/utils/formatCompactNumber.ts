/** Abrevia a partir de 1,000 para ejes y etiquetas: 950 → "950", 1,500 → "1.5K", 2,000,000 → "2M". */
export function formatCompactNumber(value: number): string {
  const absolute = Math.abs(value)

  if (absolute >= 1_000_000) {
    return `${trimDecimals(value / 1_000_000)}M`
  }

  if (absolute >= 1_000) {
    return `${trimDecimals(value / 1_000)}K`
  }

  return trimDecimals(value)
}

export function formatCompactCurrency(value: number): string {
  return `Q${formatCompactNumber(value)}`
}

function trimDecimals(value: number): string {
  return String(Number(value.toFixed(1)))
}
