import { apiFetch } from './api'
import type {
  CreateSupplierPayload,
  DeliveryDay,
  DeliveryIncident,
  DeliveryIncidentStatus,
  DeliveryIncidentType,
  PaginatedSuppliers,
  PurchaseOrder,
  RecordDeliveryPayload,
  RecordDeliveryResponse,
  Supplier,
  SupplierFilters,
  UpdateSupplierPayload,
} from '@/types/supplier'

function buildQueryString(filters: SupplierFilters): string {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (filters.is_active !== undefined) {
    params.set('is_active', String(filters.is_active))
  }
  if (filters.delivery_day_id) {
    params.set('delivery_day_id', String(filters.delivery_day_id))
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

export function getSuppliers(filters: SupplierFilters = {}): Promise<PaginatedSuppliers> {
  return apiFetch<PaginatedSuppliers>(`/suppliers${buildQueryString(filters)}`)
}

export function getSupplier(id: number): Promise<{ data: Supplier }> {
  return apiFetch<{ data: Supplier }>(`/suppliers/${id}`)
}

export function getSupplierHistory(
  id: number,
): Promise<{ purchase_orders: PurchaseOrder[]; delivery_incidents: DeliveryIncident[] }> {
  return apiFetch<{ purchase_orders: PurchaseOrder[]; delivery_incidents: DeliveryIncident[] }>(
    `/suppliers/${id}/history`,
  )
}

export function getDeliveryDays(): Promise<{ data: DeliveryDay[] }> {
  return apiFetch<{ data: DeliveryDay[] }>('/delivery-days')
}

export function getDeliveryIncidentTypes(): Promise<{ data: DeliveryIncidentType[] }> {
  return apiFetch<{ data: DeliveryIncidentType[] }>('/delivery-incident-types')
}

export function getDeliveryIncidentStatuses(): Promise<{ data: DeliveryIncidentStatus[] }> {
  return apiFetch<{ data: DeliveryIncidentStatus[] }>('/delivery-incident-statuses')
}

export function createSupplier(
  payload: CreateSupplierPayload,
): Promise<{ data: Supplier; message: string }> {
  return apiFetch<{ data: Supplier; message: string }>('/suppliers', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateSupplier(
  id: number,
  payload: UpdateSupplierPayload,
): Promise<{ data: Supplier; message: string }> {
  return apiFetch<{ data: Supplier; message: string }>(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function toggleSupplierStatus(
  id: number,
): Promise<{ data: Supplier; message: string }> {
  return apiFetch<{ data: Supplier; message: string }>(`/suppliers/${id}/status`, {
    method: 'PATCH',
  })
}

export function deleteSupplier(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/suppliers/${id}`, {
    method: 'DELETE',
  })
}

export function recordDelivery(
  supplierId: number,
  payload: RecordDeliveryPayload,
): Promise<RecordDeliveryResponse> {
  return apiFetch<RecordDeliveryResponse>(`/suppliers/${supplierId}/deliveries`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
