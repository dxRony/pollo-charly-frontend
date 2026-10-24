import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartGrid } from '@/components/molecules/ChartGrid'
import { ColumnChart } from '@/components/molecules/ColumnChart'
import { DonutChart } from '@/components/molecules/DonutChart'
import { RankedBarChart } from '@/components/molecules/RankedBarChart'
import type { InventoryWasteReport } from '@/types/report'
import { rankBy, sumByDay } from '@/utils/chartData'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatCompactCurrency } from '@/utils/formatCompactNumber'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatFullDate, formatShortDate } from '@/utils/formatShortDate'

interface InventoryWasteReportChartsProps {
  report: InventoryWasteReport
  dateFrom?: string
  dateTo?: string
}

const WASTE_TYPE_COLORS: Record<string, string> = {
  'Merma / Daño': CHART_COLORS.blue,
  'Ajuste por merma': CHART_COLORS.aqua,
  'Ajuste por faltante': CHART_COLORS.brand,
  'Ajuste físico (faltante)': CHART_COLORS.amber,
  'Merma / Pérdida': CHART_COLORS.violet,
}

export function InventoryWasteReportCharts({ report, dateFrom, dateTo }: InventoryWasteReportChartsProps) {
  const { rows, by_supply } = report

  const daily = useMemo(
    () =>
      sumByDay(
        rows,
        (row) => row.date,
        (row) => row.total_cost,
        dateFrom,
        dateTo,
      ),
    [rows, dateFrom, dateTo],
  )

  const supplies = useMemo(
    () =>
      [...by_supply]
        .sort((a, b) => b.total_cost - a.total_cost)
        .slice(0, 8)
        .map((item) => ({ label: item.supply_name, value: item.total_cost })),
    [by_supply],
  )

  const typeSlices = useMemo(
    () =>
      rankBy(
        rows,
        (row) => row.type,
        (row) => row.total_cost,
      ).map((item) => ({
        ...item,
        color: WASTE_TYPE_COLORS[item.label] ?? CHART_COLORS.violet,
      })),
    [rows],
  )

  const emptyMessage = 'No hay pérdidas registradas con los filtros seleccionados.'

  return (
    <ChartGrid>
      <ChartCard
        title="Costo de pérdidas por día"
        subtitle="Valor de los insumos perdidos en cada día"
        wide
        isEmpty={rows.length === 0}
        emptyMessage={emptyMessage}
        table={{
          columns: ['Fecha', 'Costo de pérdida'],
          rows: daily.map((day) => [formatShortDate(day.date), formatCurrency(day.value)]),
        }}
      >
        <ColumnChart
          data={daily}
          xKey="date"
          series={[{ key: 'value', label: 'Costo de pérdida', color: CHART_COLORS.brand }]}
          valueFormatter={formatCurrency}
          axisFormatter={formatCompactCurrency}
          xTickFormatter={formatShortDate}
          tooltipLabelFormatter={formatFullDate}
        />
      </ChartCard>

      <ChartCard
        title="Pérdida por insumo"
        subtitle="Los 8 insumos con mayor costo de pérdida"
        isEmpty={supplies.length === 0}
        emptyMessage={emptyMessage}
        table={{
          columns: ['Insumo', 'Costo de pérdida'],
          rows: supplies.map((item) => [item.label, formatCurrency(item.value)]),
        }}
      >
        <RankedBarChart
          data={supplies}
          series={[{ key: 'value', label: 'Costo de pérdida', color: CHART_COLORS.brand }]}
          valueFormatter={formatCurrency}
        />
      </ChartCard>

      <ChartCard
        title="Pérdida por tipo"
        subtitle="Cómo se originó el costo perdido"
        isEmpty={typeSlices.length === 0}
        emptyMessage={emptyMessage}
        table={{
          columns: ['Tipo de pérdida', 'Costo de pérdida'],
          rows: typeSlices.map((slice) => [slice.label, formatCurrency(slice.value)]),
        }}
      >
        <DonutChart slices={typeSlices} valueFormatter={formatCurrency} totalCaption="perdido" />
      </ChartCard>
    </ChartGrid>
  )
}
