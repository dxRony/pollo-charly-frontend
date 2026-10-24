import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartLegend } from '@/components/molecules/ChartLegend'
import { ChartTooltip } from '@/components/molecules/ChartTooltip'
import { useChartAnimation } from '@/hooks/useChartAnimation'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { CHART_FONT_SIZE, CHART_INK } from '@/utils/chartTheme'

export interface RankedBarSeries {
  key: string
  label: string
  color: string
}

export type RankedBarDatum = { label: string } & Record<string, number | string>

interface RankedBarChartProps {
  data: RankedBarDatum[]
  /** Una serie: barras de un solo color. Varias: barras agrupadas con leyenda. */
  series: RankedBarSeries[]
  valueFormatter: (value: number) => string
  /** Fija el máximo del eje (p. ej. 100 para porcentajes). */
  axisMax?: number
}

interface CategoryTickProps {
  x?: number | string
  y?: number | string
  payload?: { value?: string | number }
  maxChars: number
}

function CategoryTick({ x, y, payload, maxChars }: CategoryTickProps) {
  const text = String(payload?.value ?? '')
  const shown = text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text

  return (
    <text x={Number(x)} y={Number(y)} dy={4} textAnchor="end" fill={CHART_INK.secondary} fontSize={CHART_FONT_SIZE}>
      <title>{text}</title>
      {shown}
    </text>
  )
}

const BAR_SIZE = 16
const GROUP_PADDING = 18

export function RankedBarChart({ data, series, valueFormatter, axisMax }: RankedBarChartProps) {
  const animate = useChartAnimation()
  const isNarrow = useMediaQuery('(max-width: 640px)')
  const labelWidth = isNarrow ? 104 : 150
  const maxChars = isNarrow ? 12 : 21
  const rowHeight = series.length * BAR_SIZE + GROUP_PADDING
  const height = data.length * rowHeight + 8

  return (
    <div>
      {series.length > 1 && (
        <ChartLegend items={series.map((item) => ({ label: item.label, color: item.color }))} />
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: isNarrow ? 64 : 80, bottom: 4, left: 0 }}
          barCategoryGap={GROUP_PADDING / 2}
          barGap={2}
        >
          <XAxis type="number" hide domain={[0, axisMax ?? 'auto']} />
          <YAxis
            type="category"
            dataKey="label"
            width={labelWidth}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: CHART_INK.axis }}
            tick={(props) => <CategoryTick {...props} maxChars={maxChars} />}
          />
          <Tooltip
            cursor={{ fill: CHART_INK.cursor }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload}
                label={props.label}
                formatValue={valueFormatter}
              />
            )}
          />
          {series.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              fill={item.color}
              barSize={BAR_SIZE}
              radius={[0, 4, 4, 0]}
              isAnimationActive={animate}
            >
              <LabelList
                dataKey={item.key}
                position="right"
                formatter={(value) => valueFormatter(Number(value))}
                fill={CHART_INK.primary}
                fontSize={CHART_FONT_SIZE}
                fontWeight={600}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
