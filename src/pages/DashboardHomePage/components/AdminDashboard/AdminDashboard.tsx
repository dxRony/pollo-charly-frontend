import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics'
import { KpiCard } from '@/components/molecules/KpiCard'
import { DashboardChartsGrid } from '@/components/organisms/DashboardChartsGrid'
import { Button } from '@/components/atoms/Button'
import { formatCurrency } from '@/utils/formatCurrency'
import { DashboardHero } from '../DashboardHero/DashboardHero'
import styles from './AdminDashboard.module.css'

export function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { metrics, isLoading, error, refetch } = useDashboardMetrics()

  if (isLoading) {
    return <p className={styles.loading}>Cargando métricas del sistema...</p>
  }

  if (error || !metrics) {
    return (
      <div className={styles.container}>
        <DashboardHero
          userName={user?.name ?? 'Administrador'}
          roleName="Administrador"
          subtitle="Panel de control gerencial del sistema Pollo Charly."
        />
        <div className={styles.error} role="alert">
          <p>{error ?? 'No fue posible obtener las métricas del sistema.'}</p>
          <Button size="sm" onClick={refetch} style={{ marginTop: '1rem' }}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  const { kpis } = metrics

  return (
    <div className={styles.container}>
      <DashboardHero
        userName={user?.name ?? 'Administrador'}
        roleName="Administrador"
        subtitle="Panel de control gerencial. Monitorea en tiempo real el rendimiento comercial y operativo del restaurante."
        actions={
          <>
            <Button size="sm" variant="accent" onClick={() => navigate('/dashboard/reports')}>
              📊 Ver Reportes
            </Button>
            <Button size="sm" variant="primary" onClick={() => navigate('/dashboard/daily-menu')}>
              🍗 Menú del Día
            </Button>
          </>
        }
      />

      {kpis.pending_alerts_count > 0 && (
        <aside className={styles.alertBanner} aria-label="Alerta de inventario">
          <div className={styles.alertContent}>
            <span className={styles.alertIcon} aria-hidden="true">
              ⚠️
            </span>
            <div>
              <strong>Alertas de inventario pendientes:</strong> Hay{' '}
              <span>{kpis.pending_alerts_count}</span> insumo(s) con niveles críticos o solicitudes
              por atender.
            </div>
          </div>
          <Button size="sm" variant="primary" onClick={() => navigate('/dashboard/supply-alerts')}>
            Revisar Alertas
          </Button>
        </aside>
      )}

      <section aria-label="Indicadores clave de rendimiento">
        <h2 className={styles.sectionTitle}>📌 Indicadores del Periodo</h2>
        <div className={styles.kpiGrid}>
          <KpiCard icon="💰" label="Ventas totales" value={formatCurrency(kpis.total_sales)} />
          <KpiCard icon="🧾" label="Total transacciones" value={String(kpis.sales_count)} />
          <KpiCard icon="🎯" label="Ticket promedio" value={formatCurrency(kpis.average_ticket)} />
          <KpiCard icon="🔥" label="Comandas activas" value={String(kpis.active_orders_count)} />
          <KpiCard icon="🪑" label="Mesas ocupadas" value={String(kpis.occupied_tables_count)} />
          <KpiCard
            icon="⭐"
            label="Platillo estrella"
            value={kpis.top_dish_name ?? 'Sin ventas aún'}
          />
        </div>
      </section>

      <section aria-label="Gráficas del sistema">
        <h2 className={styles.sectionTitle}>📈 Gráficas de Rendimiento</h2>
        <DashboardChartsGrid metrics={metrics} />
      </section>
    </div>
  )
}
