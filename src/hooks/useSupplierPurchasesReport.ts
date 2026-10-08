import { useCallback, useEffect, useState } from 'react'
import * as reportService from '@/services/reportService'
import type { SupplierPurchasesReport, SupplierPurchasesReportFilters } from '@/types/report'

export function useSupplierPurchasesReport() {
  const [report, setReport] = useState<SupplierPurchasesReport | null>(null)
  const [filters, setFilters] = useState<SupplierPurchasesReportFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async (currentFilters: SupplierPurchasesReportFilters) => {
    try {
      const response = await reportService.getSupplierPurchasesReport(currentFilters)
      setReport(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte de compras y proveedores.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { date_from, date_to, supplier_id, status } = filters

  useEffect(() => {
    // fetchReport siempre depende de una petición real con los filtros vigentes;
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport({ date_from, date_to, supplier_id, status })
  }, [fetchReport, date_from, date_to, supplier_id, status])

  return {
    report,
    filters,
    isLoading,
    error,
    updateFilters: (partial: Partial<SupplierPurchasesReportFilters>) =>
      setFilters((prev) => ({ ...prev, ...partial })),
  }
}
