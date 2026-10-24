import type { TooltipContentProps } from 'recharts'
import styles from './ChartTooltip.module.css'

interface ChartTooltipProps extends Pick<TooltipContentProps, 'active' | 'payload' | 'label'> {
  formatLabel?: (label: string) => string
  formatValue: (value: number, seriesName: string) => string
  /** En gráficas apiladas oculta las series en cero para que el detalle muestre solo lo que ocurrió. */
  hideZeroValues?: boolean
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatLabel,
  formatValue,
  hideZeroValues = false,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const heading = label === undefined ? undefined : String(label)
  const nonZero = payload.filter((entry) => Number(entry.value ?? 0) !== 0)
  const entries = hideZeroValues && nonZero.length > 0 ? nonZero : payload

  return (
    <div className={styles.tooltip}>
      {heading && <p className={styles.heading}>{formatLabel ? formatLabel(heading) : heading}</p>}
      <ul className={styles.rows}>
        {entries.map((entry, index) => {
          const name = String(entry.name ?? '')
          const color = entry.color ?? entry.payload?.fill ?? entry.payload?.color

          return (
            <li key={`${name}-${index}`} className={styles.row}>
              <span className={styles.key} style={{ background: color }} aria-hidden="true" />
              <strong className={styles.value}>{formatValue(Number(entry.value ?? 0), name)}</strong>
              <span className={styles.name}>{name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
