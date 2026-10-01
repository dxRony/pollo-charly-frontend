import { useCallback, useEffect, useState } from 'react'
import * as reportService from '@/services/reportService'
import type { DashboardFilters, DashboardMetrics } from '@/types/report'

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [filters, setFilters] = useState<DashboardFilters>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async (currentFilters: DashboardFilters) => {
    try {
      const response = await reportService.getDashboardMetrics(currentFilters)
      setMetrics(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las métricas del panel.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { date_from, date_to } = filters

  useEffect(() => {
    // fetchMetrics siempre depende de una petición real con los filtros vigentes;
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMetrics({ date_from, date_to })
  }, [fetchMetrics, date_from, date_to])

  return {
    metrics,
    filters,
    isLoading,
    error,
    updateFilters: (partial: Partial<DashboardFilters>) => setFilters((prev) => ({ ...prev, ...partial })),
    refetch: () => fetchMetrics(filters),
  }
}
