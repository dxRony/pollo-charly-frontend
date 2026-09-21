export interface DishRecipeLine {
  id: number
  supply_id: number
  supply_name: string | null
  measurement_unit: string | null
  required_quantity: number
}

export interface DishComplementLine {
  id: number
  name: string
  extra_price: number
}

export interface Dish {
  id: number
  name: string
  category_id: number
  category: { id: number; name: string } | null
  description: string | null
  price: number
  image_url: string | null
  is_daily_menu: boolean
  is_active: boolean
  recipes: DishRecipeLine[]
  complements: DishComplementLine[]
  created_at: string
}

export interface PaginatedDishes {
  data: Dish[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface DishFilters {
  search?: string
  category_id?: number
  is_active?: boolean
  page?: number
  per_page?: number
}

export interface DishRecipeInput {
  supply_id: number
  required_quantity: number
}

export interface CreateDishPayload {
  name: string
  category_id: number
  description?: string
  price: number
  image_url?: string
  is_active?: boolean
  recipes?: DishRecipeInput[]
  complements?: number[]
}

export interface UpdateDishPayload {
  name: string
  category_id: number
  description?: string
  price: number
  image_url?: string
  is_active?: boolean
  recipes?: DishRecipeInput[]
  complements?: number[]
}

export interface DishMutationResponse {
  message: string
  dish: Dish
}
