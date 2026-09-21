import { apiFetch } from './api'
import type {
  CreateDishPayload,
  DishFilters,
  DishMutationResponse,
  PaginatedDishes,
  UpdateDishPayload,
} from '@/types/dish'

function buildQueryString(filters: DishFilters): string {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (filters.category_id) {
    params.set('category_id', String(filters.category_id))
  }
  if (filters.is_active !== undefined) {
    params.set('is_active', String(filters.is_active))
  }
  if (filters.page) {
    params.set('page', String(filters.page))
  }
  if (filters.per_page) {
    params.set('per_page', String(filters.per_page))
  }

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export function getDishes(filters: DishFilters = {}): Promise<PaginatedDishes> {
  return apiFetch<PaginatedDishes>(`/dishes${buildQueryString(filters)}`)
}

export function createDish(payload: CreateDishPayload): Promise<DishMutationResponse> {
  return apiFetch<DishMutationResponse>('/dishes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateDish(id: number, payload: UpdateDishPayload): Promise<DishMutationResponse> {
  return apiFetch<DishMutationResponse>(`/dishes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function toggleDishStatus(id: number, isActive: boolean): Promise<DishMutationResponse> {
  return apiFetch<DishMutationResponse>(`/dishes/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  })
}
