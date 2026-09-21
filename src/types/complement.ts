export interface ComplementSupplyLine {
  id: number
  supply_id: number
  supply_name: string | null
  measurement_unit: string | null
  required_quantity: number
}

export interface Complement {
  id: number
  name: string
  description: string | null
  extra_price: number
  is_active: boolean
  supplies: ComplementSupplyLine[]
  created_at: string
}

export interface PaginatedComplements {
  data: Complement[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface ComplementFilters {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

export interface ComplementSupplyInput {
  supply_id: number
  required_quantity: number
}

export interface CreateComplementPayload {
  name: string
  description?: string
  extra_price: number
  is_active?: boolean
  supplies?: ComplementSupplyInput[]
}

export interface UpdateComplementPayload {
  name: string
  description?: string
  extra_price: number
  is_active?: boolean
  supplies?: ComplementSupplyInput[]
}

export interface ComplementMutationResponse {
  message: string
  complement: Complement
}
