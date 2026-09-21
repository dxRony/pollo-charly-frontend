import { apiFetch } from './api'
import type {
  CreateTablePayload,
  RestaurantTable,
  RestaurantTableFilters,
  TableMutationResponse,
  UpdateTablePayload,
} from '@/types/restaurantTable'

function buildQueryString(filters: RestaurantTableFilters): string {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (filters.status) {
    params.set('status', filters.status)
  }

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export function getRestaurantTables(
  filters: RestaurantTableFilters = {},
): Promise<{ data: RestaurantTable[] }> {
  return apiFetch<{ data: RestaurantTable[] }>(`/restaurant-tables${buildQueryString(filters)}`)
}

export function createTable(payload: CreateTablePayload): Promise<TableMutationResponse> {
  return apiFetch<TableMutationResponse>('/restaurant-tables', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateTable(id: number, payload: UpdateTablePayload): Promise<TableMutationResponse> {
  return apiFetch<TableMutationResponse>(`/restaurant-tables/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function toggleTableStatus(id: number, isActive: boolean): Promise<TableMutationResponse> {
  return apiFetch<TableMutationResponse>(`/restaurant-tables/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  })
}
