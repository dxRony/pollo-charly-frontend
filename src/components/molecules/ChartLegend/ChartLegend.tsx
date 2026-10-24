import styles from './ChartLegend.module.css'

export interface ChartLegendItem {
  label: string
  color: string
}

interface ChartLegendProps {
  items: ChartLegendItem[]
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <ul className={styles.legend}>
      {items.map((item) => (
        <li key={item.label} className={styles.item}>
          <span className={styles.swatch} style={{ background: item.color }} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
