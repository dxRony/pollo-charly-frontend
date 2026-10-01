import { useState } from 'react'
import { RestaurantTablesFilterBar } from '@/components/organisms/RestaurantTablesFilterBar'
import { RestaurantTablesTable } from '@/components/organisms/RestaurantTablesTable'
import { RestaurantTableFormModal } from '@/components/organisms/RestaurantTableFormModal'
import { useRestaurantTables } from '@/hooks/useRestaurantTables'
import * as restaurantTableService from '@/services/restaurantTableService'
import { ApiError } from '@/services/api'
import type {
  CreateTablePayload,
  RestaurantTable,
  UpdateTablePayload,
} from '@/types/restaurantTable'
import styles from './RestaurantTablesPage.module.css'

type ModalState = { mode: 'create' } | { mode: 'edit'; table: RestaurantTable } | null

export function RestaurantTablesPage() {
  const { tables, filters, isLoading, error, updateFilters, refetch } = useRestaurantTables()
  const [modalState, setModalState] = useState<ModalState>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleFormSubmit(payload: CreateTablePayload | UpdateTablePayload) {
    if (modalState?.mode === 'edit') {
      await restaurantTableService.updateTable(modalState.table.id, payload as UpdateTablePayload)
    } else {
      await restaurantTableService.createTable(payload as CreateTablePayload)
    }
    setModalState(null)
    await refetch()
  }

  async function handleToggleStatus(table: RestaurantTable) {
    setActionError(null)
    try {
      await restaurantTableService.toggleTableStatus(table.id, table.status_name === 'inactiva')
      await refetch()
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setActionError(Object.values(err.errors).flat().join(' '))
      } else {
        setActionError(err instanceof Error ? err.message : 'No se pudo cambiar el estado de la mesa.')
      }
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Gestión de mesas</h1>

      <RestaurantTablesFilterBar
        search={filters.search ?? ''}
        status={filters.status ?? ''}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onStatusChange={(value) => updateFilters({ status: value === '' ? undefined : value })}
        onCreateClick={() => setModalState({ mode: 'create' })}
      />

      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando mesas...</p>
      ) : (
        <RestaurantTablesTable
          tables={tables}
          onEdit={(table) => setModalState({ mode: 'edit', table })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {modalState && (
        <RestaurantTableFormModal
          mode={modalState.mode}
          initialTable={modalState.mode === 'edit' ? modalState.table : undefined}
          onClose={() => setModalState(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
