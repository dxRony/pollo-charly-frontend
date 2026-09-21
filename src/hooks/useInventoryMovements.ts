import { useCallback, useEffect, useState } from 'react'
import * as inventoryMovementService from '@/services/inventoryMovementService'
import type { InventoryMovement, InventoryMovementFilters } from '@/types/inventoryMovement'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: InventoryMovementFilters = { page: 1, per_page: 10 }

export function useInventoryMovements() {
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<InventoryMovementFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMovements = useCallback(async (currentFilters: InventoryMovementFilters) => {
    try {
      const response = await inventoryMovementService.getInventoryMovements(currentFilters)
      setMovements(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los movimientos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { supply_id, type, pending_adjustments, search, page, per_page } = filters

  useEffect(() => {
    // fetchMovements siempre depende de una petición real (paginación + filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMovements({ supply_id, type, pending_adjustments, search, page, per_page })
  }, [fetchMovements, supply_id, type, pending_adjustments, search, page, per_page])

  function updateFilters(partial: Partial<InventoryMovementFilters>) {
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
    movements,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchMovements(filters),
  }
}
