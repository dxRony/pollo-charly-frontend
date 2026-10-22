import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useKitchenOrders } from '@/hooks/useKitchenOrders'
import { usePublicDailyMenu } from '@/hooks/usePublicDailyMenu'
import { KpiCard } from '@/components/molecules/KpiCard'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { DashboardHero } from '../DashboardHero/DashboardHero'
import styles from './CookDashboard.module.css'

export function CookDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { orders, isLoading: isLoadingOrders, isConnected } = useKitchenOrders()
  const { dishes, isLoading: isLoadingMenu } = usePublicDailyMenu()

  const cookingOrders = orders.filter((o) => o.order_status === 'en_preparacion')
  const waitingOrders = orders.filter((o) => o.order_status !== 'en_preparacion')

  const isLoading = isLoadingOrders || isLoadingMenu

  if (isLoading) {
    return <p className={styles.loading}>Cargando comandas y menú de cocina...</p>
  }

  return (
    <div className={styles.container}>
      <DashboardHero
        userName={user?.name ?? 'Cocinero'}
        roleName="Cocinero"
        subtitle="Panel de producción y cocina. Monitorea la cola de comandas en preparación y consulta los platillos activos del menú."
        actions={
          <Badge tone={isConnected ? 'success' : 'warning'}>
            {isConnected ? '🟢 En vivo' : '🟡 Conectado'}
          </Badge>
        }
      />

      <section aria-label="Métricas de producción de cocina">
        <h2 className={styles.sectionTitle}>📌 Estado Actual de Cocina</h2>
        <div className={styles.kpiGrid}>
          <KpiCard icon="⏳" label="Por iniciar" value={`${waitingOrders.length} en espera`} />
          <KpiCard icon="🔥" label="En preparación" value={`${cookingOrders.length} cocinando`} />
          <KpiCard icon="🍲" label="Total en cola" value={String(orders.length)} />
          <KpiCard icon="🍗" label="Platillos del día" value={`${dishes.length} activos`} />
        </div>
      </section>

      <section className={styles.queueSection} aria-label="Cola de pedidos en espera">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            🍳 Comandas en Espera y Preparación ({orders.length})
          </h2>
          <Button size="sm" variant="accent" onClick={() => navigate('/dashboard/kitchen')}>
            Ver Pantalla Completa KDS
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎉</div>
            <p>
              <strong>¡Cocina al día!</strong>
            </p>
            <p>No hay comandas pendientes por preparar en este momento.</p>
          </div>
        ) : (
          <div className={styles.queueGrid}>
            {orders.slice(0, 6).map((order) => {
              const isCooking = order.order_status === 'en_preparacion'

              return (
                <article
                  key={order.id}
                  className={[
                    styles.orderCard,
                    isCooking ? styles.orderCardCooking : styles.orderCardWaiting,
                  ].join(' ')}
                >
                  <div className={styles.orderCardHeader}>
                    <div>
                      <span className={styles.orderCode}>#{order.code}</span>
                      <div className={styles.orderLocation}>
                        {order.table?.number
                          ? `🪑 Mesa ${order.table.number}`
                          : '📦 Para llevar'}
                      </div>
                    </div>
                    <Badge tone={isCooking ? 'warning' : 'accent'}>
                      {isCooking ? '🔥 Cocinando' : '⏳ Por iniciar'}
                    </Badge>
                  </div>

                  <ul className={styles.orderItems}>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <div className={styles.orderItemRow}>
                          <span className={styles.itemQuantity}>{item.quantity}x</span>
                          <span className={styles.itemName}>
                            {item.dish?.name ?? 'Platillo'}
                          </span>
                        </div>
                        {item.complements.length > 0 && (
                          <div className={styles.itemComplements}>
                            + {item.complements.map((c) => c.complement?.name).join(', ')}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => navigate('/dashboard/kitchen')}
                  >
                    Atender en Cocina
                  </Button>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className={styles.menuSection} aria-label="Menú del día">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📅 Platillos del Menú de Hoy ({dishes.length})</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Preparaciones y recetas activas
          </span>
        </div>

        {dishes.length === 0 ? (
          <p className={styles.emptyState}>No se han publicado platillos en el menú del día.</p>
        ) : (
          <div className={styles.menuGrid}>
            {dishes.map((dish) => (
              <div key={dish.id} className={styles.menuItemCard}>
                <span className={styles.menuItemName}>🍗 {dish.name}</span>
                <span className={styles.menuItemCategory}>
                  {dish.category?.name ?? 'General'}
                </span>
                {dish.complements.length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {dish.complements.length} complementos opcionales
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
