import { apiFetch } from './api'
import type {
  ComplementFilters,
  ComplementMutationResponse,
  CreateComplementPayload,
  PaginatedComplements,
  UpdateComplementPayload,
} from '@/types/complement'

function buildQueryString(filters: ComplementFilters): string {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
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

export function getComplements(filters: ComplementFilters = {}): Promise<PaginatedComplements> {
  return apiFetch<PaginatedComplements>(`/complements${buildQueryString(filters)}`)
}

export function createComplement(
  payload: CreateComplementPayload,
): Promise<ComplementMutationResponse> {
  return apiFetch<ComplementMutationResponse>('/complements', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateComplement(
  id: number,
  payload: UpdateComplementPayload,
): Promise<ComplementMutationResponse> {
  return apiFetch<ComplementMutationResponse>(`/complements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function toggleComplementStatus(
  id: number,
  isActive: boolean,
): Promise<ComplementMutationResponse> {
  return apiFetch<ComplementMutationResponse>(`/complements/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  })
}
