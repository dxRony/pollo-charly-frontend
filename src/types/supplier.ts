export interface DeliveryDay {
  id: number
  name: string
}

export interface DeliveryIncidentType {
  id: number
  name: string
}

export interface DeliveryIncidentStatus {
  id: number
  name: string
}

export interface SupplierSupply {
  id: number
  supply_id: number
  name: string
  code: string
  measurement_unit: string
  agreed_price: number
  unit_cost: number | null
}

export interface DeliveryIncident {
  id: number
  purchase_order_id: number | null
  purchase_order_code?: string | null
  supplier_id: number
  supplier_name?: string | null
  receiving_user_id: number
  receiving_user_name?: string | null
  delivery_incident_type_id: number
  type: string
  delivery_incident_status_id: number
  status: string
  description: string
  evidence_path: string | null
  created_at: string
  updated_at?: string
}

export interface PurchaseOrderItem {
  id: number
  supply_id: number
  supply_name: string
  measurement_unit: string
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
  purchase_order_status_id: number
  status: string
  total: number
  expected_date: string | null
  received_date: string | null
  items?: PurchaseOrderItem[]
  delivery_incidents?: DeliveryIncident[]
  created_at: string
}

export interface SupplierPerformance {
  total_orders: number
  completed_orders: number | null
  incident_orders: number | null
  total_incidents: number
  compliance_rate: number | null
}

export interface Supplier {
  id: number
  company_name: string
  contact_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  is_active: boolean
  delivery_days?: DeliveryDay[]
  supplies?: SupplierSupply[]
  purchase_orders_count?: number
  delivery_incidents_count?: number
  performance?: SupplierPerformance
  purchase_orders?: PurchaseOrder[]
  delivery_incidents?: DeliveryIncident[]
  created_at: string
  updated_at: string
}

export interface PaginatedSuppliers {
  data: Supplier[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface SupplierFilters {
  search?: string
  is_active?: boolean
  delivery_day_id?: number
  page?: number
  per_page?: number
}

export interface SupplierSupplyItemPayload {
  supply_id: number
  agreed_price: number
}

export interface CreateSupplierPayload {
  company_name: string
  contact_name?: string
  phone?: string
  email?: string
  address?: string
  is_active?: boolean
  delivery_day_ids?: number[]
  supplies?: SupplierSupplyItemPayload[]
}

export interface UpdateSupplierPayload {
  company_name?: string
  contact_name?: string
  phone?: string
  email?: string
  address?: string
  is_active?: boolean
  delivery_day_ids?: number[]
  supplies?: SupplierSupplyItemPayload[]
}

export interface DeliveryItemPayload {
  supply_id: number
  received_quantity: number
  unit_price?: number
}

export interface RecordDeliveryPayload {
  has_incident: boolean
  purchase_order_id?: number
  delivery_incident_type_id?: number
  description?: string
  evidence_path?: string
  notes?: string
  items?: DeliveryItemPayload[]
}

export interface RecordDeliveryResponse {
  purchase_order: PurchaseOrder
  incident: DeliveryIncident | null
  message: string
}
