import { useCallback, useEffect, useState } from 'react'
import * as complementService from '@/services/complementService'
import type { Complement, ComplementFilters } from '@/types/complement'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: ComplementFilters = { page: 1, per_page: 10 }

export function useComplements() {
  const [complements, setComplements] = useState<Complement[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<ComplementFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComplements = useCallback(async (currentFilters: ComplementFilters) => {
    try {
      const response = await complementService.getComplements(currentFilters)
      setComplements(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los complementos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { search, is_active, page, per_page } = filters

  useEffect(() => {
    // fetchComplements siempre depende de una petición real (paginación + filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComplements({ search, is_active, page, per_page })
  }, [fetchComplements, search, is_active, page, per_page])

  function updateFilters(partial: Partial<ComplementFilters>) {
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
    complements,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchComplements(filters),
  }
}
