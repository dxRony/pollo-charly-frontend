import { useCallback, useEffect, useState } from 'react'
import * as reportService from '@/services/reportService'
import type { SupplyAlertsReport, SupplyAlertsReportFilters } from '@/types/report'

export function useSupplyAlertsReport() {
  const [report, setReport] = useState<SupplyAlertsReport | null>(null)
  const [filters, setFilters] = useState<SupplyAlertsReportFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async (currentFilters: SupplyAlertsReportFilters) => {
    try {
      const response = await reportService.getSupplyAlertsReport(currentFilters)
      setReport(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte de alertas de reposición.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { date_from, date_to, status, origin, supply_id } = filters

  useEffect(() => {
    // fetchReport siempre depende de una petición real con los filtros vigentes;
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport({ date_from, date_to, status, origin, supply_id })
  }, [fetchReport, date_from, date_to, status, origin, supply_id])

  return {
    report,
    filters,
    isLoading,
    error,
    updateFilters: (partial: Partial<SupplyAlertsReportFilters>) => setFilters((prev) => ({ ...prev, ...partial })),
  }
}
