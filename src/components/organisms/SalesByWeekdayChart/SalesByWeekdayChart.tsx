import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ColumnChart } from '@/components/molecules/ColumnChart'
import type { SalesByDayPoint } from '@/types/report'
import { averageSalesByWeekday, fillSalesByDay } from '@/utils/chartData'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatCompactCurrency } from '@/utils/formatCompactNumber'
import { formatCurrency } from '@/utils/formatCurrency'

interface SalesByWeekdayChartProps {
  points: SalesByDayPoint[]
  dateFrom?: string
  dateTo?: string
}

export function SalesByWeekdayChart({ points, dateFrom, dateTo }: SalesByWeekdayChartProps) {
  const weekdays = useMemo(
    () => averageSalesByWeekday(fillSalesByDay(points, dateFrom, dateTo)),
    [points, dateFrom, dateTo],
  )

  return (
    <ChartCard
      title="Venta promedio por día de la semana"
      subtitle="Qué días vende más el restaurante"
      isEmpty={points.length === 0}
      emptyMessage="No hay ventas registradas en el periodo seleccionado."
      table={{
        columns: ['Día', 'Venta promedio'],
        rows: weekdays.map((day) => [day.label, formatCurrency(day.value)]),
      }}
    >
      <ColumnChart
        data={weekdays}
        xKey="label"
        series={[{ key: 'value', label: 'Venta promedio', color: CHART_COLORS.brand }]}
        valueFormatter={formatCurrency}
        axisFormatter={formatCompactCurrency}
      />
    </ChartCard>
  )
}
