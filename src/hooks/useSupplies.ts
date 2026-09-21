import { useCallback, useEffect, useState } from 'react'
import * as supplyService from '@/services/supplyService'
import type { Supply, SupplyFilters } from '@/types/supply'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: SupplyFilters = { page: 1, per_page: 10 }

export function useSupplies() {
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<SupplyFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSupplies = useCallback(async (currentFilters: SupplyFilters) => {
    try {
      const response = await supplyService.getSupplies(currentFilters)
      setSupplies(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los insumos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { search, measurement_unit_id, is_active, low_stock, page, per_page } = filters

  useEffect(() => {
    // fetchSupplies siempre depende de una petición real (paginación + filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSupplies({ search, measurement_unit_id, is_active, low_stock, page, per_page })
  }, [fetchSupplies, search, measurement_unit_id, is_active, low_stock, page, per_page])

  function updateFilters(partial: Partial<SupplyFilters>) {
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
    supplies,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchSupplies(filters),
  }
}
