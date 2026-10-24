import { useMemo } from 'react'
import { AreaTrendChart } from '@/components/molecules/AreaTrendChart'
import { ChartCard } from '@/components/molecules/ChartCard'
import type { SalesByDayPoint } from '@/types/report'
import { fillSalesByDay } from '@/utils/chartData'
import { formatCompactCurrency } from '@/utils/formatCompactNumber'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatShortDate } from '@/utils/formatShortDate'

interface SalesByDayChartProps {
  points: SalesByDayPoint[]
  dateFrom?: string
  dateTo?: string
}

export function SalesByDayChart({ points, dateFrom, dateTo }: SalesByDayChartProps) {
  const days = useMemo(() => fillSalesByDay(points, dateFrom, dateTo), [points, dateFrom, dateTo])

  return (
    <ChartCard
      title="Ventas por día"
      subtitle="Total vendido en cada día del periodo"
      wide
      isEmpty={points.length === 0}
      emptyMessage="No hay ventas registradas en el periodo seleccionado."
      table={{
        columns: ['Fecha', 'Ventas', 'Total vendido'],
        rows: days.map((day) => [formatShortDate(day.date), day.count, formatCurrency(day.total)]),
      }}
    >
      <AreaTrendChart
        data={days.map((day) => ({ date: day.date, value: day.total }))}
        seriesName="Total vendido"
        valueFormatter={formatCurrency}
        axisFormatter={formatCompactCurrency}
      />
    </ChartCard>
  )
}
