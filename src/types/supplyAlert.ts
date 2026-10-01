import type { Supply } from './supply'

export type SupplyAlertOriginAlias = 'manual' | 'automatic'
export type SupplyAlertStatusAlias = 'pending' | 'attended'

export interface SupplyAlertUserRef {
  id: number
  name: string
  email: string
  role: string | null
}

export interface SupplyAlert {
  id: number
  supply_id: number
  supply: Supply | null
  alert_origin_id: number
  origin: { id: number; name: string } | null
  origin_name: string
  alert_status_id: number
  status: { id: number; name: string } | null
  status_name: string
  user_id: number | null
  user: SupplyAlertUserRef | null
  purchase_request_id: number | null
  notes: string | null
  created_at: string
}

export interface PaginatedSupplyAlerts {
  data: SupplyAlert[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface SupplyAlertFilters {
  status?: SupplyAlertStatusAlias
  origin?: SupplyAlertOriginAlias
  supply_id?: number
  search?: string
  page?: number
  per_page?: number
}

export interface CreateSupplyAlertPayload {
  supply_id: number
  notes?: string
}

export interface AttendSupplyAlertPayload {
  notes?: string
}

export interface SupplyAlertMutationResponse {
  message: string
  alert: SupplyAlert
}

export const ALERT_ORIGIN_LABELS: Record<string, string> = {
  manual: 'Manual',
  automatic: 'Automática',
}

export const ALERT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  attended: 'Atendida',
}
