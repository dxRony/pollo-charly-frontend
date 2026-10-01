import { useCallback, useEffect, useState } from 'react'
import * as reportService from '@/services/reportService'
import type { SalesReport, SalesReportFilters } from '@/types/report'

export function useSalesReport() {
  const [report, setReport] = useState<SalesReport | null>(null)
  const [filters, setFilters] = useState<SalesReportFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async (currentFilters: SalesReportFilters) => {
    try {
      const response = await reportService.getSalesReport(currentFilters)
      setReport(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte de ventas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { date_from, date_to, cashier_user_id, payment_method } = filters

  useEffect(() => {
    // fetchReport siempre depende de una petición real con los filtros vigentes;
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport({ date_from, date_to, cashier_user_id, payment_method })
  }, [fetchReport, date_from, date_to, cashier_user_id, payment_method])

  return {
    report,
    filters,
    isLoading,
    error,
    updateFilters: (partial: Partial<SalesReportFilters>) => setFilters((prev) => ({ ...prev, ...partial })),
  }
}
