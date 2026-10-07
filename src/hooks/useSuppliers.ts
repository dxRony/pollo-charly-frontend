import { useCallback, useEffect, useState } from 'react'
import * as supplierService from '@/services/supplierService'
import type { Supplier, SupplierFilters } from '@/types/supplier'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: SupplierFilters = { page: 1, per_page: 10 }

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<SupplierFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuppliers = useCallback(async (currentFilters: SupplierFilters) => {
    setIsLoading(true)
    try {
      const response = await supplierService.getSuppliers(currentFilters)
      setSuppliers(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los proveedores.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { search, is_active, delivery_day_id, page, per_page } = filters

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSuppliers({ search, is_active, delivery_day_id, page, per_page })
  }, [fetchSuppliers, search, is_active, delivery_day_id, page, per_page])

  function updateFilters(partial: Partial<SupplierFilters>) {
    setFilters((previous) => ({
      ...previous,
      ...partial,
      page: partial.page ?? 1,
    }))
  }

  function setPage(pageNumber: number) {
    setFilters((previous) => ({ ...previous, page: pageNumber }))
  }

  return {
    suppliers,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchSuppliers(filters),
  }
}
