import { useCallback, useEffect, useState } from 'react'
import * as userService from '@/services/userService'
import type { User } from '@/types/auth'
import type { UserFilters } from '@/types/user'

interface PaginationInfo {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

const DEFAULT_FILTERS: UserFilters = { page: 1, per_page: 10 }

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (currentFilters: UserFilters) => {
    try {
      const response = await userService.getUsers(currentFilters)
      setUsers(response.data)
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        total: response.total,
        lastPage: response.last_page,
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { search, role_id, is_active, page, per_page } = filters

  useEffect(() => {
    // fetchUsers siempre depende de una petición real (paginación + filtros arbitrarios);
    // no hay valor calculable de forma síncrona para evitar este efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers({ search, role_id, is_active, page, per_page })
  }, [fetchUsers, search, role_id, is_active, page, per_page])

  function updateFilters(partial: Partial<UserFilters>) {
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
    users,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch: () => fetchUsers(filters),
  }
}
