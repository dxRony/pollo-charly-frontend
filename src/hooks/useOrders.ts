import { useCallback, useEffect, useState } from 'react'
import * as orderService from '@/services/orderService'
import { ACTIVE_ORDER_STATUSES } from '@/types/order'
import type { Order, OrderFilters } from '@/types/order'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: OrderFilters = { status: ACTIVE_ORDER_STATUSES, page: 1, per_page: 10 }

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (currentFilters: OrderFilters) => {
    try {
      const response = await orderService.getOrders(currentFilters)
      setOrders(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las comandas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { status, order_type, search, page, per_page } = filters

  useEffect(() => {
    // fetchOrders siempre depende de una petición real (paginación + filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders({ status, order_type, search, page, per_page })
  }, [fetchOrders, status, order_type, search, page, per_page])

  function updateFilters(partial: Partial<OrderFilters>) {
    setFilters((previous) => ({
      ...previous,
      ...partial,
      page: partial.page ?? 1,
    }))
  }

  function setPage(pageNumber: number) {
    setFilters((previous) => ({ ...previous, page: pageNumber }))
  }

  return {
    orders,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchOrders(filters),
  }
}
