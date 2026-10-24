import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartGrid } from '@/components/molecules/ChartGrid'
import { RankedBarChart } from '@/components/molecules/RankedBarChart'
import { SalesByDayChart } from '@/components/organisms/SalesByDayChart'
import { SalesByPaymentMethodChart } from '@/components/organisms/SalesByPaymentMethodChart'
import type { SalesReportRow } from '@/types/report'
import { aggregateSalesByDay, aggregateSalesByPaymentMethod, rankBy } from '@/utils/chartData'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatCurrency } from '@/utils/formatCurrency'

interface SalesReportChartsProps {
  rows: SalesReportRow[]
  dateFrom?: string
  dateTo?: string
}

export function SalesReportCharts({ rows, dateFrom, dateTo }: SalesReportChartsProps) {
  const points = useMemo(() => aggregateSalesByDay(rows), [rows])

  const payments = useMemo(() => aggregateSalesByPaymentMethod(rows), [rows])

  const cashiers = useMemo(
    () =>
      rankBy(
        rows,
        (row) => row.cashier_name,
        (row) => row.total,
        6,
      ),
    [rows],
  )

  return (
    <ChartGrid>
      <SalesByDayChart points={points} dateFrom={dateFrom} dateTo={dateTo} />

      <SalesByPaymentMethodChart payments={payments} />

      <ChartCard
        title="Ventas por cajero"
        subtitle="Total vendido por cada persona en caja"
        isEmpty={cashiers.length === 0}
        emptyMessage="No hay ventas registradas con los filtros seleccionados."
        table={{
          columns: ['Cajero', 'Total vendido'],
          rows: cashiers.map((item) => [item.label, formatCurrency(item.value)]),
        }}
      >
        <RankedBarChart
          data={cashiers}
          series={[{ key: 'value', label: 'Total vendido', color: CHART_COLORS.brand }]}
          valueFormatter={formatCurrency}
        />
      </ChartCard>
    </ChartGrid>
  )
}
