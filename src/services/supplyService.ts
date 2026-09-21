import { apiFetch } from './api'
import type {
  CreateSupplyPayload,
  MeasurementUnit,
  PaginatedSupplies,
  SupplyFilters,
  SupplyMutationResponse,
  UpdateSupplyPayload,
} from '@/types/supply'

function buildQueryString(filters: SupplyFilters): string {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (filters.measurement_unit_id) {
    params.set('measurement_unit_id', String(filters.measurement_unit_id))
  }
  if (filters.is_active !== undefined) {
    params.set('is_active', String(filters.is_active))
  }
  if (filters.low_stock) {
    params.set('low_stock', String(filters.low_stock))
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

export function getSupplies(filters: SupplyFilters = {}): Promise<PaginatedSupplies> {
  return apiFetch<PaginatedSupplies>(`/supplies${buildQueryString(filters)}`)
}

export function getMeasurementUnits(): Promise<MeasurementUnit[]> {
  return apiFetch<MeasurementUnit[]>('/measurement-units')
}

export function createSupply(payload: CreateSupplyPayload): Promise<SupplyMutationResponse> {
  return apiFetch<SupplyMutationResponse>('/supplies', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateSupply(id: number, payload: UpdateSupplyPayload): Promise<SupplyMutationResponse> {
  return apiFetch<SupplyMutationResponse>(`/supplies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function toggleSupplyStatus(id: number, isActive: boolean): Promise<SupplyMutationResponse> {
  return apiFetch<SupplyMutationResponse>(`/supplies/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  })
}
