import { apiFetch } from './api'
import type {
  CancelOrderPayload,
  CreateOrderPayload,
  KitchenOrders,
  ModifyOrderPayload,
  OrderFilters,
  OrderMutationResponse,
  PaginatedOrders,
  UpdateOrderStatusPayload,
} from '@/types/order'

function buildQueryString(filters: OrderFilters): string {
  const params = new URLSearchParams()

  if (filters.status) {
    params.set('status', filters.status)
  }
  if (filters.order_type) {
    params.set('order_type', filters.order_type)
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

export function getOrders(filters: OrderFilters = {}): Promise<PaginatedOrders> {
  return apiFetch<PaginatedOrders>(`/orders${buildQueryString(filters)}`)
}

export function createOrder(payload: CreateOrderPayload): Promise<OrderMutationResponse> {
  return apiFetch<OrderMutationResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function cancelOrder(
  id: number,
  payload: CancelOrderPayload = {},
): Promise<OrderMutationResponse> {
  return apiFetch<OrderMutationResponse>(`/orders/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function modifyOrder(id: number, payload: ModifyOrderPayload): Promise<OrderMutationResponse> {
  return apiFetch<OrderMutationResponse>(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getKitchenOrders(): Promise<KitchenOrders> {
  return apiFetch<KitchenOrders>('/kitchen/orders')
}

export function updateOrderStatus(
  id: number,
  payload: UpdateOrderStatusPayload,
): Promise<OrderMutationResponse> {
  return apiFetch<OrderMutationResponse>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
