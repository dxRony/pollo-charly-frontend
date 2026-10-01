import { useCallback, useEffect, useState } from 'react'
import * as supplyAlertService from '@/services/supplyAlertService'
import type { SupplyAlert, SupplyAlertFilters } from '@/types/supplyAlert'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: SupplyAlertFilters = { status: 'pending', page: 1, per_page: 10 }

export function useSupplyAlerts() {
  const [alerts, setAlerts] = useState<SupplyAlert[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<SupplyAlertFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async (currentFilters: SupplyAlertFilters) => {
    try {
      const response = await supplyAlertService.getSupplyAlerts(currentFilters)
      setAlerts(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las alertas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { status, origin, supply_id, search, page, per_page } = filters

  useEffect(() => {
    // fetchAlerts siempre depende de una petición real (paginación + filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlerts({ status, origin, supply_id, search, page, per_page })
  }, [fetchAlerts, status, origin, supply_id, search, page, per_page])

  function updateFilters(partial: Partial<SupplyAlertFilters>) {
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
    alerts,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchAlerts(filters),
  }
}
