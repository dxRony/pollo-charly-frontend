import { useCallback, useEffect, useState } from 'react'
import * as dishService from '@/services/dishService'
import type { Dish } from '@/types/dish'

export function useActiveDishes() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDishes = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await dishService.getDishes({ is_active: true, per_page: 100 })
      setDishes(response.data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // fetchDishes depende de una petición real; no hay valor calculable de forma síncrona.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDishes()
  }, [fetchDishes])

  return { dishes, isLoading, refetch: fetchDishes }
}
