import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartGrid } from '@/components/molecules/ChartGrid'
import { ColumnChart } from '@/components/molecules/ColumnChart'
import type { ColumnSeries } from '@/components/molecules/ColumnChart'
import { RankedBarChart } from '@/components/molecules/RankedBarChart'
import type { InventoryMovementReportRow } from '@/types/report'
import { countByDayAndCategory, rankBy } from '@/utils/chartData'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatFullDate, formatShortDate } from '@/utils/formatShortDate'

interface InventoryMovementsReportChartsProps {
  rows: InventoryMovementReportRow[]
  dateFrom?: string
  dateTo?: string
}

const CATEGORY_BY_TYPE: Record<string, string> = {
  compra_entrada: 'compra',
  consumo_venta: 'salida',
  merma_dano: 'merma',
  ajuste_inventario: 'ajuste',
  ajuste_merma: 'ajuste',
  ajuste_sobrante: 'ajuste',
  ajuste_faltante: 'ajuste',
  ajuste_conteo_fisico: 'ajuste',
  cancelacion_pedido: 'cancelacion',
}

const CATEGORY_SERIES: ColumnSeries[] = [
  { key: 'compra', label: 'Compra', color: CHART_COLORS.blue },
  { key: 'salida', label: 'Salida', color: CHART_COLORS.aqua },
  { key: 'merma', label: 'Merma', color: CHART_COLORS.brand },
  { key: 'ajuste', label: 'Ajuste', color: CHART_COLORS.amber },
  { key: 'cancelacion', label: 'Cancelación', color: CHART_COLORS.violet },
]

const formatCount = (value: number) => `${value} mov.`

export function InventoryMovementsReportCharts({ rows, dateFrom, dateTo }: InventoryMovementsReportChartsProps) {
  const daily = useMemo(
    () =>
      countByDayAndCategory(
        rows,
        (row) => row.date,
        (row) => (row.type ? (CATEGORY_BY_TYPE[row.type] ?? null) : null),
        CATEGORY_SERIES.map((series) => series.key),
        dateFrom,
        dateTo,
      ),
    [rows, dateFrom, dateTo],
  )

  const topSupplies = useMemo(
    () =>
      rankBy(
        rows,
        (row) => row.supply_name,
        () => 1,
        8,
      ),
    [rows],
  )

  return (
    <ChartGrid>
      <ChartCard
        title="Movimientos por día"
        subtitle="Cantidad de movimientos según su tipo"
        wide
        isEmpty={rows.length === 0}
        emptyMessage="No hay movimientos registrados con los filtros seleccionados."
        table={{
          columns: ['Fecha', ...CATEGORY_SERIES.map((series) => series.label)],
          rows: daily.map((day) => [
            formatShortDate(String(day.date)),
            ...CATEGORY_SERIES.map((series) => Number(day[series.key])),
          ]),
        }}
      >
        <ColumnChart
          data={daily}
          xKey="date"
          series={CATEGORY_SERIES}
          valueFormatter={formatCount}
          axisFormatter={String}
          integerAxis
          xTickFormatter={formatShortDate}
          tooltipLabelFormatter={formatFullDate}
        />
      </ChartCard>

      <ChartCard
        title="Insumos con más movimientos"
        subtitle="Los 8 insumos con más actividad"
        wide
        isEmpty={topSupplies.length === 0}
        emptyMessage="No hay movimientos registrados con los filtros seleccionados."
        table={{
          columns: ['Insumo', 'Movimientos'],
          rows: topSupplies.map((item) => [item.label, item.value]),
        }}
      >
        <RankedBarChart
          data={topSupplies}
          series={[{ key: 'value', label: 'Movimientos', color: CHART_COLORS.brand }]}
          valueFormatter={formatCount}
        />
      </ChartCard>
    </ChartGrid>
  )
}
