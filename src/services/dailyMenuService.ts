import { apiFetch } from './api'
import type { Dish } from '@/types/dish'

interface DailyMenuUpdateResponse {
  message: string
  data: Dish[]
}

export function getDailyMenu(): Promise<Dish[]> {
  return apiFetch<Dish[]>('/daily-menu')
}

export function updateDailyMenu(dishIds: number[]): Promise<DailyMenuUpdateResponse> {
  return apiFetch<DailyMenuUpdateResponse>('/daily-menu', {
    method: 'PUT',
    body: JSON.stringify({ dish_ids: dishIds }),
  })
}
