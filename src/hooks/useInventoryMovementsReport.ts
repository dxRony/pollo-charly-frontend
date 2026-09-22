import { useCallback, useEffect, useState } from 'react'
import * as reportService from '@/services/reportService'
import type { InventoryMovementsReport, InventoryMovementsReportFilters } from '@/types/report'

export function useInventoryMovementsReport() {
  const [report, setReport] = useState<InventoryMovementsReport | null>(null)
  const [filters, setFilters] = useState<InventoryMovementsReportFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async (currentFilters: InventoryMovementsReportFilters) => {
    try {
      const response = await reportService.getInventoryMovementsReport(currentFilters)
      setReport(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte de movimientos de inventario.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { date_from, date_to, type, supply_id } = filters

  useEffect(() => {
    // fetchReport siempre depende de una petición real con los filtros vigentes;
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport({ date_from, date_to, type, supply_id })
  }, [fetchReport, date_from, date_to, type, supply_id])

  return {
    report,
    filters,
    isLoading,
    error,
    updateFilters: (partial: Partial<InventoryMovementsReportFilters>) =>
      setFilters((prev) => ({ ...prev, ...partial })),
  }
}
