import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartGrid } from '@/components/molecules/ChartGrid'
import { RankedBarChart } from '@/components/molecules/RankedBarChart'
import type { SupplierPurchasesReport } from '@/types/report'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatCurrency } from '@/utils/formatCurrency'

interface SupplierPurchasesReportChartsProps {
  report: SupplierPurchasesReport
}

const formatPercent = (value: number) => `${value}%`

export function SupplierPurchasesReportCharts({ report }: SupplierPurchasesReportChartsProps) {
  const spending = useMemo(
    () =>
      [...report.by_supplier]
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 8)
        .map((item) => ({ label: item.supplier_name, value: item.total_spent })),
    [report.by_supplier],
  )

  const performance = useMemo(
    () =>
      [...report.by_supplier]
        .sort((a, b) => b.orders_count - a.orders_count)
        .slice(0, 8)
        .map((item) => ({
          label: item.supplier_name,
          fulfillment: item.fulfillment_rate,
          punctuality: item.punctuality_rate,
        })),
    [report.by_supplier],
  )

  const emptyMessage = 'No hay compras registradas con los filtros seleccionados.'

  return (
    <ChartGrid>
      <ChartCard
        title="Total comprado por proveedor"
        subtitle="Los 8 proveedores con mayor monto comprado"
        isEmpty={spending.length === 0}
        emptyMessage={emptyMessage}
        table={{
          columns: ['Proveedor', 'Total comprado'],
          rows: spending.map((item) => [item.label, formatCurrency(item.value)]),
        }}
      >
        <RankedBarChart
          data={spending}
          series={[{ key: 'value', label: 'Total comprado', color: CHART_COLORS.brand }]}
          valueFormatter={formatCurrency}
        />
      </ChartCard>

      <ChartCard
        title="Cumplimiento y puntualidad"
        subtitle="Desempeño de los proveedores con más órdenes"
        isEmpty={performance.length === 0}
        emptyMessage={emptyMessage}
        table={{
          columns: ['Proveedor', 'Cumplimiento', 'Puntualidad'],
          rows: performance.map((item) => [
            item.label,
            formatPercent(item.fulfillment),
            formatPercent(item.punctuality),
          ]),
        }}
      >
        <RankedBarChart
          data={performance}
          series={[
            { key: 'fulfillment', label: 'Cumplimiento', color: CHART_COLORS.blue },
            { key: 'punctuality', label: 'Puntualidad', color: CHART_COLORS.aqua },
          ]}
          valueFormatter={formatPercent}
          axisMax={100}
        />
      </ChartCard>
    </ChartGrid>
  )
}
