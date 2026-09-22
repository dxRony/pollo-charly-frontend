import { apiDownload, apiFetch } from './api'
import type {
  DashboardFilters,
  DashboardMetrics,
  InventoryMovementsReport,
  InventoryMovementsReportFilters,
  ReportExportFormat,
  SalesReport,
  SalesReportFilters,
  SupplyAlertsReport,
  SupplyAlertsReportFilters,
  TopDishesReport,
  TopDishesReportFilters,
} from '@/types/report'

function toQuery<T extends object>(filters: T): string {
  const params = new URLSearchParams()
  Object.entries(filters as Record<string, string | number | undefined>).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  })
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export function getDashboardMetrics(filters: DashboardFilters): Promise<DashboardMetrics> {
  return apiFetch<DashboardMetrics>(`/reports/dashboard${toQuery(filters)}`)
}

export function getSalesReport(filters: SalesReportFilters): Promise<SalesReport> {
  return apiFetch<SalesReport>(`/reports/sales${toQuery(filters)}`)
}

export function getTopDishesReport(filters: TopDishesReportFilters): Promise<TopDishesReport> {
  return apiFetch<TopDishesReport>(`/reports/top-dishes${toQuery(filters)}`)
}

export function getInventoryMovementsReport(
  filters: InventoryMovementsReportFilters,
): Promise<InventoryMovementsReport> {
  return apiFetch<InventoryMovementsReport>(`/reports/inventory-movements${toQuery(filters)}`)
}

export function getSupplyAlertsReport(filters: SupplyAlertsReportFilters): Promise<SupplyAlertsReport> {
  return apiFetch<SupplyAlertsReport>(`/reports/supply-alerts${toQuery(filters)}`)
}

export function exportReport<T extends object>(
  reportPath: 'sales' | 'top-dishes' | 'inventory-movements' | 'supply-alerts',
  filters: T,
  format: ReportExportFormat,
  filename: string,
): Promise<void> {
  return apiDownload(`/reports/${reportPath}${toQuery({ ...filters, format })}`, filename)
}
