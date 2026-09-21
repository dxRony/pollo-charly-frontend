import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { SuppliesFilterBar } from '@/components/organisms/SuppliesFilterBar'
import { SuppliesTable } from '@/components/organisms/SuppliesTable'
import { SupplyFormModal } from '@/components/organisms/SupplyFormModal'
import { useSupplies } from '@/hooks/useSupplies'
import { useMeasurementUnits } from '@/hooks/useMeasurementUnits'
import * as supplyService from '@/services/supplyService'
import type { Supply, CreateSupplyPayload, UpdateSupplyPayload } from '@/types/supply'
import styles from './SuppliesPage.module.css'

type ModalState = { mode: 'create' } | { mode: 'edit'; supply: Supply } | null

export function SuppliesPage() {
  const { supplies, pagination, filters, isLoading, error, updateFilters, setPage, refetch } =
    useSupplies()
  const { measurementUnits } = useMeasurementUnits()
  const [modalState, setModalState] = useState<ModalState>(null)

  async function handleFormSubmit(payload: CreateSupplyPayload | UpdateSupplyPayload) {
    if (modalState?.mode === 'edit') {
      await supplyService.updateSupply(modalState.supply.id, payload as UpdateSupplyPayload)
    } else {
      await supplyService.createSupply(payload as CreateSupplyPayload)
    }
    setModalState(null)
    await refetch()
  }

  async function handleToggleStatus(supply: Supply) {
    await supplyService.toggleSupplyStatus(supply.id, !supply.is_active)
    await refetch()
  }

  return (
    <div>
      <h1 className={styles.title}>Gestión de insumos</h1>

      <SuppliesFilterBar
        search={filters.search ?? ''}
        measurementUnitId={filters.measurement_unit_id ?? ''}
        isActive={filters.is_active === undefined ? '' : String(filters.is_active)}
        lowStockOnly={filters.low_stock ?? false}
        measurementUnits={measurementUnits}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onMeasurementUnitChange={(value) =>
          updateFilters({ measurement_unit_id: value === '' ? undefined : value })
        }
        onStatusChange={(value) =>
          updateFilters({ is_active: value === '' ? undefined : value === 'true' })
        }
        onLowStockChange={(value) => updateFilters({ low_stock: value || undefined })}
        onCreateClick={() => setModalState({ mode: 'create' })}
      />

      {error && <p className={styles.error}>{error}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando insumos...</p>
      ) : (
        <SuppliesTable
          supplies={supplies}
          onEdit={(supply) => setModalState({ mode: 'edit', supply })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {pagination && pagination.lastPage > 1 && (
        <div className={styles.pagination}>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage <= 1}
            onClick={() => setPage(pagination.currentPage - 1)}
          >
            Anterior
          </Button>
          <span className={styles.pageInfo}>
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => setPage(pagination.currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {modalState && (
        <SupplyFormModal
          mode={modalState.mode}
          measurementUnits={measurementUnits}
          initialSupply={modalState.mode === 'edit' ? modalState.supply : undefined}
          onClose={() => setModalState(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
