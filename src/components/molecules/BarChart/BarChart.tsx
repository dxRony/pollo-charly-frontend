import styles from './BarChart.module.css'

export interface BarChartDatum {
  label: string
  value: number
}

interface BarChartProps {
  data: BarChartDatum[]
  valueFormatter?: (value: number) => string
  emptyMessage?: string
}

export function BarChart({ data, valueFormatter = (value) => String(value), emptyMessage }: BarChartProps) {
  if (data.length === 0) {
    return <p className={styles.empty}>{emptyMessage ?? 'No hay datos para mostrar.'}</p>
  }

  const maxValue = Math.max(...data.map((datum) => datum.value), 1)

  return (
    <div className={styles.chart}>
      {data.map((datum) => (
        <div key={datum.label} className={styles.row} title={`${datum.label}: ${valueFormatter(datum.value)}`}>
          <span className={styles.label}>{datum.label}</span>
          <div className={styles.track}>
            <div className={styles.bar} style={{ width: `${(datum.value / maxValue) * 100}%` }} />
          </div>
          <span className={styles.value}>{valueFormatter(datum.value)}</span>
        </div>
      ))}
    </div>
  )
}
