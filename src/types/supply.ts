export interface MeasurementUnit {
  id: number
  name: string
  abbreviation: string
}

export interface Supply {
  id: number
  code: string
  name: string
  measurement_unit_id: number
  measurement_unit: MeasurementUnit | null
  current_stock: number
  minimum_stock: number
  unit_cost: number
  is_active: boolean
  is_low_stock: boolean
  created_at: string
}

export interface PaginatedSupplies {
  data: Supply[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface SupplyFilters {
  search?: string
  measurement_unit_id?: number
  is_active?: boolean
  low_stock?: boolean
  page?: number
  per_page?: number
}

export interface CreateSupplyPayload {
  name: string
  code?: string
  measurement_unit_id: number
  minimum_stock: number
  unit_cost: number
  is_active?: boolean
}

export interface UpdateSupplyPayload {
  name: string
  code?: string
  measurement_unit_id: number
  minimum_stock: number
  unit_cost: number
  is_active?: boolean
}

export interface SupplyMutationResponse {
  message: string
  supply: Supply
}
