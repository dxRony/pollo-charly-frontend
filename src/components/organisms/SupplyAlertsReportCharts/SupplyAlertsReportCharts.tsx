import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartGrid } from '@/components/molecules/ChartGrid'
import { ColumnChart } from '@/components/molecules/ColumnChart'
import type { ColumnSeries } from '@/components/molecules/ColumnChart'
import { RankedBarChart } from '@/components/molecules/RankedBarChart'
import type { SupplyAlertReportRow } from '@/types/report'
import { ALERT_STATUS_LABELS } from '@/types/supplyAlert'
import { countByDayAndCategory, rankBy } from '@/utils/chartData'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatFullDate, formatShortDate } from '@/utils/formatShortDate'

interface SupplyAlertsReportChartsProps {
  rows: SupplyAlertReportRow[]
  dateFrom?: string
  dateTo?: string
}

const STATUS_SERIES: ColumnSeries[] = [
  { key: 'pending', label: ALERT_STATUS_LABELS.pending, color: CHART_COLORS.amber },
  { key: 'attended', label: ALERT_STATUS_LABELS.attended, color: CHART_COLORS.aqua },
]

const formatCount = (value: number) => `${value} alerta${value === 1 ? '' : 's'}`

export function SupplyAlertsReportCharts({ rows, dateFrom, dateTo }: SupplyAlertsReportChartsProps) {
  const daily = useMemo(
    () =>
      countByDayAndCategory(
        rows,
        (row) => row.date,
        (row) => row.status,
        STATUS_SERIES.map((series) => series.key),
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
        title="Alertas por día"
        subtitle="Alertas generadas según su estado"
        isEmpty={rows.length === 0}
        emptyMessage="No hay alertas registradas con los filtros seleccionados."
        table={{
          columns: ['Fecha', ...STATUS_SERIES.map((series) => series.label)],
          rows: daily.map((day) => [
            formatShortDate(String(day.date)),
            ...STATUS_SERIES.map((series) => Number(day[series.key])),
          ]),
        }}
      >
        <ColumnChart
          data={daily}
          xKey="date"
          series={STATUS_SERIES}
          valueFormatter={formatCount}
          axisFormatter={String}
          integerAxis
          xTickFormatter={formatShortDate}
          tooltipLabelFormatter={formatFullDate}
        />
      </ChartCard>

      <ChartCard
        title="Insumos con más alertas"
        subtitle="Los 8 insumos que más veces entraron en alerta"
        isEmpty={topSupplies.length === 0}
        emptyMessage="No hay alertas registradas con los filtros seleccionados."
        table={{
          columns: ['Insumo', 'Alertas'],
          rows: topSupplies.map((item) => [item.label, item.value]),
        }}
      >
        <RankedBarChart
          data={topSupplies}
          series={[{ key: 'value', label: 'Alertas', color: CHART_COLORS.brand }]}
          valueFormatter={formatCount}
        />
      </ChartCard>
    </ChartGrid>
  )
}
