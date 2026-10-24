import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { RankedBarChart } from '@/components/molecules/RankedBarChart'
import type { TopDishRow } from '@/types/report'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatCurrency } from '@/utils/formatCurrency'

type TopDishesMetric = 'quantity_sold' | 'revenue'

interface TopDishesChartProps {
  rows: TopDishRow[]
  metric: TopDishesMetric
  limit?: number
  wide?: boolean
}

const METRIC_COPY: Record<
  TopDishesMetric,
  { title: string; subtitle: string; seriesLabel: string; format: (value: number) => string }
> = {
  quantity_sold: {
    title: 'Platillos más vendidos',
    subtitle: 'Por unidades vendidas',
    seriesLabel: 'Unidades vendidas',
    format: (value) => `${value} und.`,
  },
  revenue: {
    title: 'Platillos que más ingresos generan',
    subtitle: 'Por ingresos generados',
    seriesLabel: 'Ingresos generados',
    format: formatCurrency,
  },
}

export function TopDishesChart({ rows, metric, limit = 5, wide = false }: TopDishesChartProps) {
  const copy = METRIC_COPY[metric]
  const ranked = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, limit)
        .map((row) => ({ label: row.dish_name, value: row[metric] })),
    [rows, metric, limit],
  )

  return (
    <ChartCard
      title={copy.title}
      subtitle={copy.subtitle}
      wide={wide}
      isEmpty={ranked.length === 0}
      emptyMessage="No hay platillos vendidos en el periodo seleccionado."
      table={{
        columns: ['Platillo', copy.seriesLabel],
        rows: ranked.map((item) => [item.label, copy.format(item.value)]),
      }}
    >
      <RankedBarChart
        data={ranked}
        series={[{ key: 'value', label: copy.seriesLabel, color: CHART_COLORS.brand }]}
        valueFormatter={copy.format}
      />
    </ChartCard>
  )
}
