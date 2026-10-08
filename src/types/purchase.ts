export type PurchaseRequestStatusName =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada_sin_comprar'
  | 'procesada'

export type PurchaseOrderStatusName =
  | 'solicitada'
  | 'recibida_completa'
  | 'recibida_con_incidencia'
  | 'cancelada'

export interface PurchaseRequestItem {
  id: number
  supply_id: number
  supply_name?: string
  supply_code?: string
  measurement_unit?: string
  suggested_quantity: number
  approved_quantity: number | null
  current_unit_cost?: number
}

export interface PurchaseRequest {
  id: number
  requester_user_id: number
  requester_user_name?: string
  purchase_request_status_id: number
  status: PurchaseRequestStatusName
  reason: string | null
  items?: PurchaseRequestItem[]
  supply_alert_ids?: number[]
  purchase_orders?: Array<{
    id: number
    code: string
    status: string
    total: number
  }>
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: number
  supply_id: number
  supply_name?: string
  measurement_unit?: string
  ordered_quantity: number
  received_quantity: number | null
  unit_price: number
  subtotal: number
}

export interface PurchaseOrder {
  id: number
  code: string
  supplier_id: number
  supplier_name?: string
  admin_user_id: number
  admin_user_name?: string
  purchase_request_id: number | null
  purchase_order_status_id: number
  status: PurchaseOrderStatusName
  total: number
  expected_date: string | null
  received_date: string | null
  items?: PurchaseOrderItem[]
  delivery_incidents?: unknown[]
  created_at: string
  updated_at?: string
}

export interface PaginatedPurchaseRequests {
  data: PurchaseRequest[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginatedPurchaseOrders {
  data: PurchaseOrder[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PurchaseRequestFilters {
  status?: string
  search?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface PurchaseOrderFilters {
  status?: string
  supplier_id?: number
  search?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface CreatePurchaseRequestPayload {
  reason?: string
  supply_alert_id?: number
  items: Array<{
    supply_id: number
    suggested_quantity: number
  }>
}

export interface ApprovePurchaseRequestPayload {
  supplier_id: number
  expected_date?: string
  items?: Array<{
    supply_id: number
    quantity: number
    unit_price?: number
  }>
}

export interface RejectPurchaseRequestPayload {
  reason?: string
}

export interface CreatePurchaseOrderPayload {
  supplier_id: number
  purchase_request_id?: number
  expected_date?: string
  items: Array<{
    supply_id: number
    ordered_quantity: number
    unit_price?: number
  }>
}

export interface ReceivePurchaseOrderItemPayload {
  supply_id: number
  received_quantity: number
}

export interface ReceivePurchaseOrderPayload {
  received_date?: string
  notes?: string
  items?: ReceivePurchaseOrderItemPayload[]
}

export interface ReportOrderIncidentPayload {
  delivery_incident_type_id: number
  description: string
  evidence_path?: string
}

export const PURCHASE_REQUEST_STATUS_LABELS: Record<PurchaseRequestStatusName, string> = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada_sin_comprar: 'Rechazada',
  procesada: 'Procesada',
}

export const PURCHASE_ORDER_STATUS_LABELS: Record<PurchaseOrderStatusName, string> = {
  solicitada: 'Solicitada',
  recibida_completa: 'Recibida Completa',
  recibida_con_incidencia: 'Recibida con Incidencia',
  cancelada: 'Cancelada',
}
