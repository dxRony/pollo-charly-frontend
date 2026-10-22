import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useRestaurantTables } from '@/hooks/useRestaurantTables'
import { useOrders } from '@/hooks/useOrders'
import { KpiCard } from '@/components/molecules/KpiCard'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { formatCurrency } from '@/utils/formatCurrency'
import { ORDER_STATUS_LABELS, type Order } from '@/types/order'
import { TABLE_STATUS_LABELS } from '@/types/restaurantTable'
import { DashboardHero } from '../DashboardHero/DashboardHero'
import styles from './WaiterCashierDashboard.module.css'

export function WaiterCashierDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { tables, isLoading: isLoadingTables } = useRestaurantTables()
  const { orders, isLoading: isLoadingOrders } = useOrders()

  const occupiedTables = tables.filter((t) => t.status_name === 'ocupada')
  const availableTables = tables.filter((t) => t.status_name === 'disponible')
  const readyOrders = orders.filter((o) => o.order_status === 'lista')

  const isLoading = isLoadingTables || isLoadingOrders

  if (isLoading) {
    return <p className={styles.loading}>Cargando estado del salón y comandas...</p>
  }

  function getOrderStatusBadge(status: string) {
    switch (status) {
      case 'lista':
        return <Badge tone="success">¡Lista para servir!</Badge>
      case 'en_preparacion':
        return <Badge tone="warning">En cocina</Badge>
      case 'pendiente':
        return <Badge tone="accent">Por iniciar</Badge>
      default:
        return <Badge tone="neutral">{ORDER_STATUS_LABELS[status] ?? status}</Badge>
    }
  }

  return (
    <div className={styles.container}>
      <DashboardHero
        userName={user?.name ?? 'Mesero/Cajero'}
        roleName="Mesero / Cajero"
        subtitle="Panel operativo de atención. Monitorea el estado de las mesas en sala, las comandas en cocina y atiende los cobros."
        actions={
          <Button size="sm" variant="primary" onClick={() => navigate('/dashboard/orders')}>
            🧾 Registrar Nueva Comanda
          </Button>
        }
      />

      {readyOrders.length > 0 && (
        <section className={styles.readyNotice} aria-label="Comandas listas para entrega">
          <div className={styles.readyHeader}>
            <span>🛎️</span>
            <span>¡Hay {readyOrders.length} comanda(s) listas en cocina para servir!</span>
          </div>
          <div className={styles.readyGrid}>
            {readyOrders.map((order: Order) => (
              <div key={order.id} className={styles.readyCard}>
                <div className={styles.readyCardInfo}>
                  <span className={styles.readyCode}>Comanda #{order.code}</span>
                  <span className={styles.readyTable}>
                    {order.table?.number ? `🪑 Mesa ${order.table.number}` : '📦 Para llevar'}
                  </span>
                </div>
                <Button size="sm" variant="accent" onClick={() => navigate('/dashboard/orders')}>
                  Entregar
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Indicadores operativos de salón">
        <h2 className={styles.sectionTitle}>📌 Estado Operativo del Salón</h2>
        <div className={styles.kpiGrid}>
          <KpiCard
            icon="🪑"
            label="Mesas ocupadas"
            value={`${occupiedTables.length} / ${tables.length}`}
          />
          <KpiCard
            icon="🟢"
            label="Mesas disponibles"
            value={`${availableTables.length} libres`}
          />
          <KpiCard icon="🔥" label="Comandas activas" value={String(orders.length)} />
          <KpiCard icon="🔔" label="Listas para servir" value={String(readyOrders.length)} />
        </div>
      </section>

      <section className={styles.tablesSection} aria-label="Plano de mesas">
        <div className={styles.tablesHeader}>
          <h2 className={styles.sectionTitle}>🗺️ Estado de Mesas en Vivo</h2>
          <div className={styles.tableLegend}>
            <div className={styles.legendItem}>
              <span className={[styles.legendDot, styles.dotAvailable].join(' ')} />
              <span>Disponible</span>
            </div>
            <div className={styles.legendItem}>
              <span className={[styles.legendDot, styles.dotOccupied].join(' ')} />
              <span>Ocupada</span>
            </div>
            <div className={styles.legendItem}>
              <span className={[styles.legendDot, styles.dotMaintenance].join(' ')} />
              <span>Mantenimiento</span>
            </div>
          </div>
        </div>

        {tables.length === 0 ? (
          <p className={styles.emptyState}>No hay mesas configuradas en el sistema.</p>
        ) : (
          <div className={styles.tablesGrid}>
            {tables.map((table) => {
              const cardClass =
                table.status_name === 'disponible'
                  ? styles.tableCardAvailable
                  : table.status_name === 'ocupada'
                    ? styles.tableCardOccupied
                    : styles.tableCardMaintenance

              return (
                <div
                  key={table.id}
                  className={[styles.tableCard, cardClass].join(' ')}
                  onClick={() => navigate('/dashboard/orders')}
                  role="button"
                  tabIndex={0}
                  title={`Mesa ${table.number} - ${TABLE_STATUS_LABELS[table.status_name] ?? table.status_name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate('/dashboard/orders')
                  }}
                >
                  <span className={styles.tableNumber}>Mesa {table.number}</span>
                  <span className={styles.tableCapacity}>👥 {table.capacity} comensales</span>
                  <Badge
                    tone={
                      table.status_name === 'disponible'
                        ? 'success'
                        : table.status_name === 'ocupada'
                          ? 'accent'
                          : 'warning'
                    }
                  >
                    {TABLE_STATUS_LABELS[table.status_name] ?? table.status_name}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className={styles.ordersSection} aria-label="Comandas activas">
        <div className={styles.tablesHeader}>
          <h2 className={styles.sectionTitle}>🧾 Comandas Activas Recientes</h2>
          <Button size="sm" variant="accent" onClick={() => navigate('/dashboard/orders')}>
            Ver Todas las Comandas
          </Button>
        </div>

        {orders.length === 0 ? (
          <p className={styles.emptyState}>No hay comandas activas en este momento.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Ubicación</th>
                  <th>Atiende</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.code}</strong>
                    </td>
                    <td>
                      {order.table?.number ? `Mesa ${order.table.number}` : '📦 Para llevar'}
                    </td>
                    <td>{order.waiter?.name ?? '—'}</td>
                    <td>
                      <strong>{formatCurrency(order.total)}</strong>
                    </td>
                    <td>{getOrderStatusBadge(order.order_status)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => navigate('/dashboard/orders')}
                      >
                        Abrir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
