import { useMemo } from 'react'
import { ChartCard } from '@/components/molecules/ChartCard'
import { DonutChart } from '@/components/molecules/DonutChart'
import type { SalesByPaymentMethodPoint } from '@/types/report'
import { PAYMENT_METHOD_OPTIONS } from '@/types/sale'
import type { PaymentMethodAlias } from '@/types/sale'
import { CHART_COLORS } from '@/utils/chartTheme'
import { formatCurrency } from '@/utils/formatCurrency'

interface SalesByPaymentMethodChartProps {
  payments: SalesByPaymentMethodPoint[]
}

const PAYMENT_METHOD_COLORS: Record<PaymentMethodAlias, string> = {
  efectivo: CHART_COLORS.aqua,
  tarjeta: CHART_COLORS.blue,
  transferencia: CHART_COLORS.brand,
}

export function SalesByPaymentMethodChart({ payments }: SalesByPaymentMethodChartProps) {
  const rows = useMemo(
    () =>
      PAYMENT_METHOD_OPTIONS.map((option) => {
        const payment = payments.find((item) => item.payment_method === option.value)

        return {
          label: option.label,
          color: PAYMENT_METHOD_COLORS[option.value],
          value: payment?.total ?? 0,
          count: payment?.count ?? 0,
        }
      }).filter((row) => row.value > 0),
    [payments],
  )

  return (
    <ChartCard
      title="Ventas por método de pago"
      subtitle="Participación en el total vendido"
      isEmpty={rows.length === 0}
      emptyMessage="No hay ventas registradas en el periodo seleccionado."
      table={{
        columns: ['Método de pago', 'Ventas', 'Total vendido'],
        rows: rows.map((row) => [row.label, row.count, formatCurrency(row.value)]),
      }}
    >
      <DonutChart slices={rows} valueFormatter={formatCurrency} totalCaption="vendido" />
    </ChartCard>
  )
}
