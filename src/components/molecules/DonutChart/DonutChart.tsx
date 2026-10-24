import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartTooltip } from '@/components/molecules/ChartTooltip'
import { useChartAnimation } from '@/hooks/useChartAnimation'
import { CHART_INK } from '@/utils/chartTheme'
import styles from './DonutChart.module.css'

export interface DonutSlice {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  slices: DonutSlice[]
  valueFormatter: (value: number) => string
  /** Texto bajo el total del centro, p. ej. "ventas". */
  totalCaption: string
}

export function DonutChart({ slices, valueFormatter, totalCaption }: DonutChartProps) {
  const animate = useChartAnimation()
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <div className={styles.wrapper}>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={(props) => (
                <ChartTooltip active={props.active} payload={props.payload} formatValue={valueFormatter} />
              )}
            />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="66%"
              outerRadius="100%"
              paddingAngle={slices.length > 1 ? 2 : 0}
              cornerRadius={4}
              startAngle={90}
              endAngle={-270}
              stroke={CHART_INK.surface}
              strokeWidth={0}
              isAnimationActive={animate}
            >
              {slices.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.center} aria-hidden="true">
          <strong className={styles.centerValue}>{valueFormatter(total)}</strong>
          <span className={styles.centerCaption}>{totalCaption}</span>
        </div>
      </div>

      <ul className={styles.legend}>
        {slices.map((slice) => (
          <li key={slice.label} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: slice.color }} aria-hidden="true" />
            <span className={styles.legendLabel}>{slice.label}</span>
            <strong className={styles.legendValue}>{valueFormatter(slice.value)}</strong>
            <span className={styles.legendShare}>
              {total > 0 ? `${Math.round((slice.value / total) * 100)}%` : '0%'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
