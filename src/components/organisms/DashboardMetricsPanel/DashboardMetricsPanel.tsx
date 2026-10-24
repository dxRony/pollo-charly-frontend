import { KpiCard } from '@/components/molecules/KpiCard'
import { DashboardChartsGrid } from '@/components/organisms/DashboardChartsGrid'
import { formatCurrency } from '@/utils/formatCurrency'
import type { DashboardMetrics } from '@/types/report'
import styles from './DashboardMetricsPanel.module.css'

interface DashboardMetricsPanelProps {
  metrics: DashboardMetrics
}

export function DashboardMetricsPanel({ metrics }: DashboardMetricsPanelProps) {
  const { kpis } = metrics

  return (
    <div className={styles.panel}>
      <div className={styles.kpiGrid}>
        <KpiCard icon="💰" label="Ventas totales" value={formatCurrency(kpis.total_sales)} />
        <KpiCard icon="🧾" label="N° de ventas" value={String(kpis.sales_count)} />
        <KpiCard icon="🎯" label="Ticket promedio" value={formatCurrency(kpis.average_ticket)} />
        <KpiCard icon="🔥" label="Comandas activas" value={String(kpis.active_orders_count)} />
        <KpiCard icon="🪑" label="Mesas ocupadas" value={String(kpis.occupied_tables_count)} />
        <KpiCard icon="⚠️" label="Alertas pendientes" value={String(kpis.pending_alerts_count)} />
      </div>

      <DashboardChartsGrid metrics={metrics} />
    </div>
  )
}
