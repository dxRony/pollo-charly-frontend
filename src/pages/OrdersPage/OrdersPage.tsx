import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { OrdersFilterBar } from '@/components/organisms/OrdersFilterBar'
import { OrdersTable } from '@/components/organisms/OrdersTable'
import { OrderFormModal } from '@/components/organisms/OrderFormModal'
import { CancelOrderModal } from '@/components/organisms/CancelOrderModal'
import { useOrders } from '@/hooks/useOrders'
import { useActiveDishes } from '@/hooks/useActiveDishes'
import { useAvailableTables } from '@/hooks/useAvailableTables'
import * as orderService from '@/services/orderService'
import type { CancelOrderPayload, CreateOrderPayload, Order } from '@/types/order'
import styles from './OrdersPage.module.css'

export function OrdersPage() {
  const { orders, pagination, filters, isLoading, error, updateFilters, setPage, refetch } = useOrders()
  const { dishes } = useActiveDishes()
  const { tables, refetch: refetchTables } = useAvailableTables()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null)

  async function handleFormSubmit(payload: CreateOrderPayload) {
    await orderService.createOrder(payload)
    setIsModalOpen(false)
    await Promise.all([refetch(), refetchTables()])
  }

  async function handleCancelConfirm(payload: CancelOrderPayload) {
    if (!cancelingOrder) {
      return
    }
    await orderService.cancelOrder(cancelingOrder.id, payload)
    setCancelingOrder(null)
    await Promise.all([refetch(), refetchTables()])
  }

  return (
    <div>
      <h1 className={styles.title}>Comandas</h1>

      <OrdersFilterBar
        search={filters.search ?? ''}
        orderType={filters.order_type ?? ''}
        status={filters.status ?? ''}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onOrderTypeChange={(value) => updateFilters({ order_type: value === '' ? undefined : value })}
        onStatusChange={(value) => updateFilters({ status: value || undefined })}
        onCreateClick={() => setIsModalOpen(true)}
      />

      {error && <p className={styles.error}>{error}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando comandas...</p>
      ) : (
        <OrdersTable orders={orders} onCancel={setCancelingOrder} />
      )}

      {pagination && pagination.lastPage > 1 && (
        <div className={styles.pagination}>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage <= 1}
            onClick={() => setPage(pagination.currentPage - 1)}
          >
            Anterior
          </Button>
          <span className={styles.pageInfo}>
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => setPage(pagination.currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {isModalOpen && (
        <OrderFormModal
          availableDishes={dishes}
          availableTables={tables}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {cancelingOrder && (
        <CancelOrderModal
          order={cancelingOrder}
          onClose={() => setCancelingOrder(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  )
}
