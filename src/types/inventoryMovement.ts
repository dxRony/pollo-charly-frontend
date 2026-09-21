import type { Supply } from './supply'

export type InventoryMovementTypeAlias = 'compra' | 'salida' | 'merma' | 'ajuste'

export interface InventoryMovementUserRef {
  id: number
  name: string
  email: string
  role: string | null
}

export interface InventoryMovement {
  id: number
  supply_id: number
  supply: Supply | null
  inventory_movement_type_id: number
  movement_type: { id: number; name: string } | null
  type: string
  user_id: number
  user: InventoryMovementUserRef | null
  quantity: number
  previous_stock: number
  new_stock: number
  reason: string | null
  order_id: number | null
  order_item_id: number | null
  purchase_order_id: number | null
  adjustment_status_type_id: number | null
  adjustment_status: { id: number; name: string } | null
  approver_user_id: number | null
  approver_user: InventoryMovementUserRef | null
  created_at: string
}

export interface PaginatedInventoryMovements {
  data: InventoryMovement[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface InventoryMovementFilters {
  supply_id?: number
  type?: InventoryMovementTypeAlias
  pending_adjustments?: boolean
  search?: string
  page?: number
  per_page?: number
}

export interface CreateInventoryMovementPayload {
  supply_id: number
  type: InventoryMovementTypeAlias
  quantity?: number
  new_stock?: number
  reason?: string
}

export interface InventoryMovementMutationResponse {
  message: string
  movement: InventoryMovement
}

export interface ReviewAdjustmentPayload {
  reason?: string
}

export const MOVEMENT_TYPE_OPTIONS: { value: InventoryMovementTypeAlias; label: string }[] = [
  { value: 'compra', label: 'Compra' },
  { value: 'salida', label: 'Salida' },
  { value: 'merma', label: 'Merma' },
  { value: 'ajuste', label: 'Ajuste' },
]

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  compra_entrada: 'Compra',
  consumo_venta: 'Salida',
  merma_dano: 'Merma',
  ajuste_inventario: 'Ajuste',
  cancelacion_pedido: 'Cancelación',
}

export const ADJUSTMENT_STATUS_LABELS: Record<string, string> = {
  pendiente_aprobacion: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
}
