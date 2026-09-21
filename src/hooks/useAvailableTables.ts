import { useCallback, useEffect, useState } from 'react'
import * as restaurantTableService from '@/services/restaurantTableService'
import type { RestaurantTable } from '@/types/restaurantTable'

export function useAvailableTables() {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTables = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await restaurantTableService.getRestaurantTables({ status: 'disponible' })
      setTables(response.data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // fetchTables depende de una petición real; no hay valor calculable de forma síncrona.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTables()
  }, [fetchTables])

  return { tables, isLoading, refetch: fetchTables }
}
