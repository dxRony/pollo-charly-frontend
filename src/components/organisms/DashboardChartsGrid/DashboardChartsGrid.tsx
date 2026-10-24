import { ChartGrid } from '@/components/molecules/ChartGrid'
import { SalesByDayChart } from '@/components/organisms/SalesByDayChart'
import { SalesByPaymentMethodChart } from '@/components/organisms/SalesByPaymentMethodChart'
import { SalesByWeekdayChart } from '@/components/organisms/SalesByWeekdayChart'
import { TopDishesChart } from '@/components/organisms/TopDishesChart'
import type { DashboardMetrics } from '@/types/report'

interface DashboardChartsGridProps {
  metrics: DashboardMetrics
}

export function DashboardChartsGrid({ metrics }: DashboardChartsGridProps) {
  const { period, sales_by_day, sales_by_payment_method, top_dishes } = metrics

  return (
    <ChartGrid>
      <SalesByDayChart points={sales_by_day} dateFrom={period.date_from} dateTo={period.date_to} />
      <SalesByWeekdayChart points={sales_by_day} dateFrom={period.date_from} dateTo={period.date_to} />
      <SalesByPaymentMethodChart payments={sales_by_payment_method} />
      <TopDishesChart rows={top_dishes} metric="quantity_sold" wide />
    </ChartGrid>
  )
}
