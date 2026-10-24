import { ChartGrid } from '@/components/molecules/ChartGrid'
import { TopDishesChart } from '@/components/organisms/TopDishesChart'
import type { TopDishRow } from '@/types/report'

interface TopDishesReportChartsProps {
  rows: TopDishRow[]
}

export function TopDishesReportCharts({ rows }: TopDishesReportChartsProps) {
  return (
    <ChartGrid>
      <TopDishesChart rows={rows} metric="quantity_sold" limit={10} />
      <TopDishesChart rows={rows} metric="revenue" limit={10} />
    </ChartGrid>
  )
}
