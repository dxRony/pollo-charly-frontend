import { apiFetch } from './api'
import type {
  CreateInventoryMovementPayload,
  InventoryMovementFilters,
  InventoryMovementMutationResponse,
  PaginatedInventoryMovements,
  ReviewAdjustmentPayload,
} from '@/types/inventoryMovement'

function buildQueryString(filters: InventoryMovementFilters): string {
  const params = new URLSearchParams()

  if (filters.supply_id) {
    params.set('supply_id', String(filters.supply_id))
  }
  if (filters.type) {
    params.set('type', filters.type)
  }
  if (filters.pending_adjustments) {
    params.set('pending_adjustments', String(filters.pending_adjustments))
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

export function getInventoryMovements(
  filters: InventoryMovementFilters = {},
): Promise<PaginatedInventoryMovements> {
  return apiFetch<PaginatedInventoryMovements>(`/inventory-movements${buildQueryString(filters)}`)
}

export function createInventoryMovement(
  payload: CreateInventoryMovementPayload,
): Promise<InventoryMovementMutationResponse> {
  return apiFetch<InventoryMovementMutationResponse>('/inventory-movements', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function approveAdjustment(
  id: number,
  payload: ReviewAdjustmentPayload = {},
): Promise<InventoryMovementMutationResponse> {
  return apiFetch<InventoryMovementMutationResponse>(`/inventory-movements/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function rejectAdjustment(
  id: number,
  payload: ReviewAdjustmentPayload = {},
): Promise<InventoryMovementMutationResponse> {
  return apiFetch<InventoryMovementMutationResponse>(`/inventory-movements/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
