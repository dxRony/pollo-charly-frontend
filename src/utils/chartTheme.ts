/**
 * Paleta de gráficos. Los colores de serie se validaron con el validador de dataviz
 * (separación para daltonismo y banda de luminosidad) sobre la superficie blanca de las tarjetas.
 * Los colores siguen a la entidad (p. ej. un método de pago), nunca a su posición en el ranking.
 */
export const CHART_COLORS = {
  brand: '#fb2c36',
  blue: '#2a78d6',
  aqua: '#1baf7a',
  amber: '#eda100',
  violet: '#6250d6',
} as const

export const CHART_INK = {
  primary: '#1a1a1a',
  secondary: '#4a4a4a',
  muted: '#6b6b6b',
  grid: '#ece9de',
  axis: '#c9c6bb',
  cursor: 'rgba(26, 26, 26, 0.05)',
  surface: '#ffffff',
} as const

export const CHART_FONT_SIZE = 12
