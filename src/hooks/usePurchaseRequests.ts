import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/services/api'
import * as purchaseService from '@/services/purchaseService'
import type {
  PaginatedPurchaseRequests,
  PurchaseRequest,
  PurchaseRequestFilters,
} from '@/types/purchase'

export function usePurchaseRequests(initialFilters: PurchaseRequestFilters = {}, enabled = true) {
  const [requests, setRequests] = useState<PurchaseRequest[]>([])
  const [pagination, setPagination] = useState<PaginatedPurchaseRequests | null>(null)
  const [filters, setFilters] = useState<PurchaseRequestFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async (currentFilters: PurchaseRequestFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await purchaseService.getPurchaseRequests(currentFilters)
      setRequests(response.data)
      setPagination(response)
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setError(Object.values(err.errors).flat().join(' '))
      } else {
        setError(err instanceof Error ? err.message : 'Error al cargar las solicitudes de compra.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { status, search, date_from, date_to, page, per_page } = filters

  useEffect(() => {
    if (enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRequests({ status, search, date_from, date_to, page, per_page })
    }
  }, [fetchRequests, status, search, date_from, date_to, page, per_page, enabled])

  function updateFilters(newFilters: Partial<PurchaseRequestFilters>) {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  function setPage(pageNumber: number) {
    setFilters((prev) => ({ ...prev, page: pageNumber }))
  }

  return {
    requests,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchRequests(filters),
  }
}
