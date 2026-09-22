import { useCallback, useEffect, useState } from 'react'
import * as reportService from '@/services/reportService'
import type { TopDishesReport, TopDishesReportFilters } from '@/types/report'

export function useTopDishesReport() {
  const [report, setReport] = useState<TopDishesReport | null>(null)
  const [filters, setFilters] = useState<TopDishesReportFilters>({ limit: 10 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async (currentFilters: TopDishesReportFilters) => {
    try {
      const response = await reportService.getTopDishesReport(currentFilters)
      setReport(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el reporte de platillos más vendidos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { date_from, date_to, category_id, limit } = filters

  useEffect(() => {
    // fetchReport siempre depende de una petición real con los filtros vigentes;
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReport({ date_from, date_to, category_id, limit })
  }, [fetchReport, date_from, date_to, category_id, limit])

  return {
    report,
    filters,
    isLoading,
    error,
    updateFilters: (partial: Partial<TopDishesReportFilters>) => setFilters((prev) => ({ ...prev, ...partial })),
  }
}
