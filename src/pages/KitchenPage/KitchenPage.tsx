import { useState } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { KitchenOrderCard } from '@/components/organisms/KitchenOrderCard'
import { useKitchenOrders } from '@/hooks/useKitchenOrders'
import * as orderService from '@/services/orderService'
import type { KitchenOrderStatusTarget, Order } from '@/types/order'
import styles from './KitchenPage.module.css'

export function KitchenPage() {
  const { orders, isLoading, error, isConnected, refetch } = useKitchenOrders()
  const [advancingId, setAdvancingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleAdvance(order: Order, nextStatus: KitchenOrderStatusTarget) {
    setActionError(null)
    setAdvancingId(order.id)

    try {
      await orderService.updateOrderStatus(order.id, { status: nextStatus })
      // El evento ComandaEstadoActualizado ya actualiza la lista vía WebSocket;
      // si no hay conexión en tiempo real, refrescamos por REST como respaldo.
      if (!isConnected) {
        await refetch()
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'No se pudo actualizar el estado de la comanda.',
      )
    } finally {
      setAdvancingId(null)
    }
  }

  const sortedOrders = [...orders].sort((a, b) => a.created_at.localeCompare(b.created_at))

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Cocina</h1>
        <Badge tone={isConnected ? 'success' : 'warning'}>
          {isConnected ? 'Tiempo real activo' : 'Sin conexión en tiempo real'}
        </Badge>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando comandas...</p>
      ) : sortedOrders.length === 0 ? (
        <p className={styles.empty}>No hay comandas pendientes ni en preparación.</p>
      ) : (
        <div className={styles.grid}>
          {sortedOrders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onAdvance={handleAdvance}
              isAdvancing={advancingId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
