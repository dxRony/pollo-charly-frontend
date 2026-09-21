import { useCallback, useEffect, useState } from 'react'
import * as restaurantTableService from '@/services/restaurantTableService'
import type { RestaurantTable, RestaurantTableFilters } from '@/types/restaurantTable'

const DEFAULT_FILTERS: RestaurantTableFilters = {}

export function useRestaurantTables() {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [filters, setFilters] = useState<RestaurantTableFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTables = useCallback(async (currentFilters: RestaurantTableFilters) => {
    try {
      const response = await restaurantTableService.getRestaurantTables(currentFilters)
      setTables(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las mesas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { search, status } = filters

  useEffect(() => {
    // fetchTables siempre depende de una petición real (filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTables({ search, status })
  }, [fetchTables, search, status])

  function updateFilters(partial: Partial<RestaurantTableFilters>) {
    setFilters((previous) => ({ ...previous, ...partial }))
  }

  return {
    tables,
    filters,
    isLoading,
    error,
    updateFilters,
    refetch: () => fetchTables(filters),
  }
}
