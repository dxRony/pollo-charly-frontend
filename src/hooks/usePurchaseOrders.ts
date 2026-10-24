import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/services/api'
import * as purchaseService from '@/services/purchaseService'
import type {
  PaginatedPurchaseOrders,
  PurchaseOrder,
  PurchaseOrderFilters,
} from '@/types/purchase'

export function usePurchaseOrders(initialFilters: PurchaseOrderFilters = {}) {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [pagination, setPagination] = useState<PaginatedPurchaseOrders | null>(null)
  const [filters, setFilters] = useState<PurchaseOrderFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (currentFilters: PurchaseOrderFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await purchaseService.getPurchaseOrders(currentFilters)
      setOrders(response.data)
      setPagination(response)
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setError(Object.values(err.errors).flat().join(' '))
      } else {
        setError(err instanceof Error ? err.message : 'Error al cargar las órdenes de compra.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { status, supplier_id, search, date_from, date_to, page, per_page } = filters

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders({ status, supplier_id, search, date_from, date_to, page, per_page })
  }, [fetchOrders, status, supplier_id, search, date_from, date_to, page, per_page])

  function updateFilters(newFilters: Partial<PurchaseOrderFilters>) {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  function setPage(pageNumber: number) {
    setFilters((prev) => ({ ...prev, page: pageNumber }))
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
