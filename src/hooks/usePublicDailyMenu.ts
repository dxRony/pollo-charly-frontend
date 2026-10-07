import { useCallback, useEffect, useState } from 'react'
import * as dailyMenuService from '@/services/dailyMenuService'
import type { PublicDish } from '@/types/dish'

export function usePublicDailyMenu() {
  const [dishes, setDishes] = useState<PublicDish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const fetchMenu = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      setDishes(await dailyMenuService.getDailyMenu())
    } catch {
      setDishes([])
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // fetchMenu depende de una petición real; no hay valor calculable de forma síncrona.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMenu()
  }, [fetchMenu])

  return { dishes, isLoading, hasError, refetch: fetchMenu }
}
