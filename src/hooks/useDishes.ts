import { useCallback, useEffect, useState } from 'react'
import * as dishService from '@/services/dishService'
import type { Dish, DishFilters } from '@/types/dish'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: DishFilters = { page: 1, per_page: 10 }

export function useDishes() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<DishFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDishes = useCallback(async (currentFilters: DishFilters) => {
    try {
      const response = await dishService.getDishes(currentFilters)
      setDishes(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los platillos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { search, category_id, is_active, page, per_page } = filters

  useEffect(() => {
    // fetchDishes siempre depende de una petición real (paginación + filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDishes({ search, category_id, is_active, page, per_page })
  }, [fetchDishes, search, category_id, is_active, page, per_page])

  function updateFilters(partial: Partial<DishFilters>) {
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
    dishes,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchDishes(filters),
  }
}
