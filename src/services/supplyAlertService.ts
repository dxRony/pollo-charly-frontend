import { apiFetch } from './api'
import type {
  AttendSupplyAlertPayload,
  CreateSupplyAlertPayload,
  PaginatedSupplyAlerts,
  SupplyAlertFilters,
  SupplyAlertMutationResponse,
} from '@/types/supplyAlert'

function buildQueryString(filters: SupplyAlertFilters): string {
  const params = new URLSearchParams()

  if (filters.status) {
    params.set('status', filters.status)
  }
  if (filters.origin) {
    params.set('origin', filters.origin)
  }
  if (filters.supply_id) {
    params.set('supply_id', String(filters.supply_id))
  }
  if (filters.search) {
    params.set('search', filters.search)
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

export function getSupplyAlerts(filters: SupplyAlertFilters = {}): Promise<PaginatedSupplyAlerts> {
  return apiFetch<PaginatedSupplyAlerts>(`/supply-alerts${buildQueryString(filters)}`)
}

export function createSupplyAlert(
  payload: CreateSupplyAlertPayload,
): Promise<SupplyAlertMutationResponse> {
  return apiFetch<SupplyAlertMutationResponse>('/supply-alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function attendSupplyAlert(
  id: number,
  payload: AttendSupplyAlertPayload = {},
): Promise<SupplyAlertMutationResponse> {
  return apiFetch<SupplyAlertMutationResponse>(`/supply-alerts/${id}/attend`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
