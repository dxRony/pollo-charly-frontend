import type { Complement } from './complement'
import type { Dish } from './dish'
import type { RestaurantTable } from './restaurantTable'

export type OrderTypeAlias = 'en_mesa' | 'para_llevar'

export interface OrderWaiterRef {
  id: number
  name: string
  email: string
}

export interface OrderItemComplementLine {
  id: number
  complement_id: number
  complement: Complement | null
  quantity: number
  unit_price: number
  subtotal: number
}

export interface OrderItemLine {
  id: number
  dish_id: number
  dish: Dish | null
  order_item_status_id: number
  status_name: string
  quantity: number
  unit_price: number
  subtotal: number
  notes: string | null
  complements: OrderItemComplementLine[]
  complements_subtotal: number
  total_with_complements: number
}

export interface Order {
  id: number
  code: string
  restaurant_table_id: number | null
  table: RestaurantTable | null
  waiter_user_id: number
  waiter: OrderWaiterRef | null
  order_type_id: number
  order_type: OrderTypeAlias
  order_status_id: number
  order_status: string
  cancellation_reason: string | null
  notes: string | null
  preparation_start_time: string | null
  items: OrderItemLine[]
  items_count: number
  active_items_count: number
  subtotal: number
  total: number
  is_modification_restricted: boolean
  can_remove_items: boolean
  modification_restriction_reason: string | null
  created_at: string
}

export interface PaginatedOrders {
  data: Order[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface OrderFilters {
  status?: string
  order_type?: OrderTypeAlias
  search?: string
  page?: number
  per_page?: number
}

export interface CreateOrderItemComplementPayload {
  complement_id: number
  quantity: number
}

export interface CreateOrderItemPayload {
  dish_id: number
  quantity: number
  notes?: string
  complements?: CreateOrderItemComplementPayload[]
}

export interface CreateOrderPayload {
  order_type: OrderTypeAlias
  restaurant_table_id?: number
  notes?: string
  items: CreateOrderItemPayload[]
}

export interface OrderMutationResponse {
  message: string
  order: Order
}

export interface CancelOrderPayload {
  cancellation_reason?: string
}

export const ORDER_TYPE_OPTIONS: { value: OrderTypeAlias; label: string }[] = [
  { value: 'en_mesa', label: 'En mesa' },
  { value: 'para_llevar', label: 'Para llevar' },
]

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  en_preparacion: 'En preparación',
  lista: 'Lista',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
}

export const ACTIVE_ORDER_STATUSES = 'pendiente,en_preparacion,lista'
