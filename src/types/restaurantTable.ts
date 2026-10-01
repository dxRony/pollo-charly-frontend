export type TableStatusName = 'disponible' | 'ocupada' | 'mantenimiento' | 'inactiva'

export interface RestaurantTable {
  id: number
  number: number
  capacity: number
  table_status_id: number
  status_name: TableStatusName
  is_available: boolean
  created_at: string
}

export interface RestaurantTableFilters {
  search?: string
  status?: TableStatusName
}

export interface CreateTablePayload {
  number: number
  capacity: number
}

export interface UpdateTablePayload {
  number: number
  capacity: number
}

export interface TableMutationResponse {
  message: string
  table: RestaurantTable
}

export const TABLE_STATUS_LABELS: Record<TableStatusName, string> = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  mantenimiento: 'Mantenimiento',
  inactiva: 'Inactiva',
}
