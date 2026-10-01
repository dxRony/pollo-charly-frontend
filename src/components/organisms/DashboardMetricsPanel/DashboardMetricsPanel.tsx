import { KpiCard } from '@/components/molecules/KpiCard'
import { BarChart } from '@/components/molecules/BarChart'
import { formatCurrency } from '@/utils/formatCurrency'
import type { DashboardMetrics } from '@/types/report'
import styles from './DashboardMetricsPanel.module.css'

interface DashboardMetricsPanelProps {
  metrics: DashboardMetrics
}

export function DashboardMetricsPanel({ metrics }: DashboardMetricsPanelProps) {
  const { kpis, sales_by_day, top_dishes } = metrics

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

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Ventas por día</h3>
          <BarChart
            data={sales_by_day.map((point) => ({ label: point.date, value: point.total }))}
            valueFormatter={formatCurrency}
            emptyMessage="No hay ventas registradas en el periodo seleccionado."
          />
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Platillos más vendidos</h3>
          <BarChart
            data={top_dishes.map((dish) => ({ label: dish.dish_name, value: dish.quantity_sold }))}
            valueFormatter={(value) => `${value} und.`}
            emptyMessage="No hay platillos vendidos en el periodo seleccionado."
          />
        </div>
      </div>
    </div>
  )
}
