import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartLegend } from '@/components/molecules/ChartLegend'
import { ChartTooltip } from '@/components/molecules/ChartTooltip'
import { useMemo } from 'react'
import { useChartAnimation } from '@/hooks/useChartAnimation'
import { niceScale } from '@/utils/chartData'
import type { DailyBucket } from '@/utils/chartData'
import { CHART_FONT_SIZE, CHART_INK } from '@/utils/chartTheme'
import styles from './ColumnChart.module.css'

export interface ColumnSeries {
  key: string
  label: string
  color: string
}

interface ColumnChartProps {
  data: DailyBucket[]
  xKey: string
  /** Con más de una serie las columnas se apilan y se muestra la leyenda. */
  series: ColumnSeries[]
  valueFormatter: (value: number) => string
  axisFormatter: (value: number) => string
  xTickFormatter?: (value: string) => string
  tooltipLabelFormatter?: (value: string) => string
  /** Para conteos: las marcas del eje son siempre enteras. */
  integerAxis?: boolean
  height?: number
}

export function ColumnChart({
  data,
  xKey,
  series,
  valueFormatter,
  axisFormatter,
  xTickFormatter,
  tooltipLabelFormatter,
  integerAxis = false,
  height = 240,
}: ColumnChartProps) {
  const animate = useChartAnimation()
  const stacked = series.length > 1
  const scale = useMemo(() => {
    const totals = data.map((row) => {
      const values = series.map((item) => Number(row[item.key] ?? 0))

      return stacked ? values.reduce((sum, value) => sum + value, 0) : Math.max(...values)
    })

    return niceScale(Math.max(0, ...totals), { integer: integerAxis })
  }, [data, series, stacked, integerAxis])

  return (
    <div className={styles.wrapper}>
      {stacked && <ChartLegend items={series.map((item) => ({ label: item.label, color: item.color }))} />}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }} barCategoryGap="20%">
          <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
          <XAxis
            dataKey={xKey}
            tickFormatter={xTickFormatter}
            minTickGap={stacked ? 28 : 8}
            tickLine={false}
            axisLine={{ stroke: CHART_INK.axis }}
            tick={{ fill: CHART_INK.muted, fontSize: CHART_FONT_SIZE }}
            tickMargin={8}
          />
          <YAxis
            tickFormatter={axisFormatter}
            width={52}
            domain={[0, scale.max]}
            ticks={scale.ticks}
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_INK.muted, fontSize: CHART_FONT_SIZE }}
          />
          <Tooltip
            cursor={{ fill: CHART_INK.cursor }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload}
                label={props.label}
                formatLabel={tooltipLabelFormatter}
                formatValue={valueFormatter}
                hideZeroValues={stacked}
              />
            )}
          />
          {series.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              fill={item.color}
              stackId={stacked ? 'stack' : undefined}
              stroke={stacked ? CHART_INK.surface : undefined}
              strokeWidth={stacked ? 2 : 0}
              maxBarSize={24}
              radius={!stacked || index === series.length - 1 ? [4, 4, 0, 0] : 0}
              isAnimationActive={animate}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
