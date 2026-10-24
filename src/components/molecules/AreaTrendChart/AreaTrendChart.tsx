import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from '@/components/molecules/ChartTooltip'
import { useMemo } from 'react'
import { useChartAnimation } from '@/hooks/useChartAnimation'
import { niceScale } from '@/utils/chartData'
import { CHART_COLORS, CHART_FONT_SIZE, CHART_INK } from '@/utils/chartTheme'
import { formatFullDate, formatShortDate } from '@/utils/formatShortDate'

export interface AreaTrendPoint {
  date: string
  value: number
}

interface AreaTrendChartProps {
  data: AreaTrendPoint[]
  seriesName: string
  valueFormatter: (value: number) => string
  axisFormatter: (value: number) => string
  color?: string
  height?: number
}

export function AreaTrendChart({
  data,
  seriesName,
  valueFormatter,
  axisFormatter,
  color = CHART_COLORS.brand,
  height = 260,
}: AreaTrendChartProps) {
  const animate = useChartAnimation()
  const scale = useMemo(() => niceScale(Math.max(0, ...data.map((point) => point.value))), [data])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          minTickGap={28}
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
          cursor={{ stroke: CHART_INK.axis, strokeWidth: 1 }}
          content={(props) => (
            <ChartTooltip
              active={props.active}
              payload={props.payload}
              label={props.label}
              formatLabel={formatFullDate}
              formatValue={valueFormatter}
            />
          )}
        />
        <Area
          type="monotone"
          dataKey="value"
          name={seriesName}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={color}
          fillOpacity={0.1}
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: CHART_INK.surface, strokeWidth: 2 }}
          isAnimationActive={animate}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
