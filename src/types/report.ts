export interface DashboardKpis {
  total_sales: number
  sales_count: number
  average_ticket: number
  active_orders_count: number
  occupied_tables_count: number
  pending_alerts_count: number
  top_dish_name: string | null
}

export interface SalesByDayPoint {
  date: string
  total: number
  count: number
}

export interface TopDishRow {
  dish_id: number
  dish_name: string
  category_name: string | null
  quantity_sold: number
  revenue: number
}

export interface DashboardMetrics {
  period: { date_from: string; date_to: string }
  kpis: DashboardKpis
  sales_by_day: SalesByDayPoint[]
  top_dishes: TopDishRow[]
}

export interface DashboardFilters {
  date_from?: string
  date_to?: string
}

export interface SalesReportRow {
  receipt_number: string
  date: string
  order_code: string | null
  table: number | null
  cashier_name: string | null
  payment_method: string | null
  receipt_type: string | null
  subtotal: number
  discount: number
  total: number
}

export interface SalesReport {
  filters: Record<string, unknown>
  summary: { total_sales: number; sales_count: number; average_ticket: number }
  rows: SalesReportRow[]
}

export interface SalesReportFilters {
  date_from?: string
  date_to?: string
  cashier_user_id?: number
  payment_method?: string
}

export interface TopDishesReport {
  filters: Record<string, unknown>
  rows: TopDishRow[]
}

export interface TopDishesReportFilters {
  date_from?: string
  date_to?: string
  category_id?: number
  limit?: number
}

export interface InventoryMovementReportRow {
  date: string
  supply_name: string | null
  type: string | null
  quantity: number
  previous_stock: number
  new_stock: number
  user_name: string | null
  reason: string | null
}

export interface InventoryMovementsReport {
  filters: Record<string, unknown>
  rows: InventoryMovementReportRow[]
}

export interface InventoryMovementsReportFilters {
  date_from?: string
  date_to?: string
  type?: string
  supply_id?: number
}

export interface SupplyAlertReportRow {
  date: string
  supply_name: string | null
  origin: string | null
  status: string | null
  user_name: string | null
  notes: string | null
}

export interface SupplyAlertsReport {
  filters: Record<string, unknown>
  rows: SupplyAlertReportRow[]
}

export interface SupplyAlertsReportFilters {
  date_from?: string
  date_to?: string
  status?: string
  origin?: string
  supply_id?: number
}

export type ReportExportFormat = 'pdf' | 'xlsx'
