import { useEffect, useState } from 'react'
import * as dailyMenuService from '@/services/dailyMenuService'
import type { Dish } from '@/types/dish'

export function usePublicDailyMenu() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dailyMenuService
      .getDailyMenu()
      .then(setDishes)
      .catch(() => setDishes([]))
      .finally(() => setIsLoading(false))
  }, [])

  return { dishes, isLoading }
}
