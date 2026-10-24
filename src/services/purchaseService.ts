import { apiFetch } from './api'
import type {
  ApprovePurchaseRequestPayload,
  CreatePurchaseOrderPayload,
  CreatePurchaseRequestPayload,
  PaginatedPurchaseOrders,
  PaginatedPurchaseRequests,
  PurchaseOrder,
  PurchaseOrderFilters,
  PurchaseRequest,
  PurchaseRequestFilters,
  ReceivePurchaseOrderPayload,
  RejectPurchaseRequestPayload,
  ReportOrderIncidentPayload,
} from '@/types/purchase'

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  }
  const str = query.toString()
  return str ? `?${str}` : ''
}

export function getPurchaseRequests(
  filters: PurchaseRequestFilters = {},
): Promise<PaginatedPurchaseRequests> {
  return apiFetch<PaginatedPurchaseRequests>(
    `/purchase-requests${buildQueryString(filters as Record<string, string | number | undefined>)}`,
  )
}

export function getPurchaseRequest(id: number): Promise<{ purchase_request: PurchaseRequest }> {
  return apiFetch<{ purchase_request: PurchaseRequest }>(`/purchase-requests/${id}`)
}

export function createPurchaseRequest(
  payload: CreatePurchaseRequestPayload,
): Promise<{ message: string; purchase_request: PurchaseRequest }> {
  return apiFetch<{ message: string; purchase_request: PurchaseRequest }>('/purchase-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function approvePurchaseRequest(
  id: number,
  payload: ApprovePurchaseRequestPayload,
): Promise<{ message: string; purchase_request: PurchaseRequest; purchase_order: PurchaseOrder }> {
  return apiFetch<{
    message: string
    purchase_request: PurchaseRequest
    purchase_order: PurchaseOrder
  }>(`/purchase-requests/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function rejectPurchaseRequest(
  id: number,
  payload: RejectPurchaseRequestPayload = {},
): Promise<{ message: string; purchase_request: PurchaseRequest }> {
  return apiFetch<{ message: string; purchase_request: PurchaseRequest }>(
    `/purchase-requests/${id}/reject`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

export function getPurchaseOrders(
  filters: PurchaseOrderFilters = {},
): Promise<PaginatedPurchaseOrders> {
  return apiFetch<PaginatedPurchaseOrders>(
    `/purchase-orders${buildQueryString(filters as Record<string, string | number | undefined>)}`,
  )
}

export function getPurchaseOrder(id: number): Promise<{ purchase_order: PurchaseOrder }> {
  return apiFetch<{ purchase_order: PurchaseOrder }>(`/purchase-orders/${id}`)
}

export function createPurchaseOrder(
  payload: CreatePurchaseOrderPayload,
): Promise<{ message: string; purchase_order: PurchaseOrder }> {
  return apiFetch<{ message: string; purchase_order: PurchaseOrder }>('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function receivePurchaseOrder(
  id: number,
  payload: ReceivePurchaseOrderPayload = {},
): Promise<{ message: string; purchase_order: PurchaseOrder }> {
  return apiFetch<{ message: string; purchase_order: PurchaseOrder }>(
    `/purchase-orders/${id}/receive`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

export function cancelPurchaseOrder(
  id: number,
): Promise<{ message: string; purchase_order: PurchaseOrder }> {
  return apiFetch<{ message: string; purchase_order: PurchaseOrder }>(
    `/purchase-orders/${id}/cancel`,
    {
      method: 'POST',
    },
  )
}

export function reportPurchaseOrderIncident(
  id: number,
  payload: ReportOrderIncidentPayload,
): Promise<{ message: string; purchase_order: PurchaseOrder; incident: unknown }> {
  return apiFetch<{ message: string; purchase_order: PurchaseOrder; incident: unknown }>(
    `/purchase-orders/${id}/incident`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

