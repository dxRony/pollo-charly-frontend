import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { InventoryMovementsFilterBar } from '@/components/organisms/InventoryMovementsFilterBar'
import { InventoryMovementsTable } from '@/components/organisms/InventoryMovementsTable'
import { InventoryMovementFormModal } from '@/components/organisms/InventoryMovementFormModal'
import { useInventoryMovements } from '@/hooks/useInventoryMovements'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import { useAuth } from '@/hooks/useAuth'
import * as inventoryMovementService from '@/services/inventoryMovementService'
import { ApiError } from '@/services/api'
import type { CreateInventoryMovementPayload, InventoryMovement } from '@/types/inventoryMovement'
import styles from './InventoryMovementsPage.module.css'

export function InventoryMovementsPage() {
  const { movements, pagination, filters, isLoading, error, updateFilters, setPage, refetch } =
    useInventoryMovements()
  const { supplies } = useActiveSupplies()
  const { user: currentUser } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleFormSubmit(payload: CreateInventoryMovementPayload) {
    const { movement } = await inventoryMovementService.createInventoryMovement(payload)

    // Una administradora no necesita esperar su propia aprobación: los ajustes que
    // ella misma registra se autoaprueban de inmediato; solo los de cocinero/mesero-cajero
    // quedan pendientes de revisión.
    if (payload.type === 'ajuste' && currentUser?.role?.name === 'Administrador') {
      try {
        await inventoryMovementService.approveAdjustment(movement.id)
      } catch (err) {
        setActionError(extractErrorMessage(err))
      }
    }

    setIsModalOpen(false)
    await refetch()
  }

  async function handleApprove(movement: InventoryMovement) {
    setActionError(null)
    try {
      await inventoryMovementService.approveAdjustment(movement.id)
      await refetch()
    } catch (err) {
      setActionError(extractErrorMessage(err))
    }
  }

  async function handleReject(movement: InventoryMovement) {
    setActionError(null)
    try {
      await inventoryMovementService.rejectAdjustment(movement.id)
      await refetch()
    } catch (err) {
      setActionError(extractErrorMessage(err))
    }
  }

  function extractErrorMessage(err: unknown): string {
    if (err instanceof ApiError && err.errors) {
      return Object.values(err.errors).flat().join(' ')
    }
    return err instanceof Error ? err.message : 'No se pudo procesar la solicitud de ajuste.'
  }

  return (
    <div>
      <h1 className={styles.title}>Movimientos de inventario</h1>

      <InventoryMovementsFilterBar
        search={filters.search ?? ''}
        supplyId={filters.supply_id ?? ''}
        type={filters.type ?? ''}
        pendingAdjustmentsOnly={filters.pending_adjustments ?? false}
        supplies={supplies}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onSupplyChange={(value) => updateFilters({ supply_id: value === '' ? undefined : value })}
        onTypeChange={(value) => updateFilters({ type: value === '' ? undefined : value })}
        onPendingAdjustmentsChange={(value) =>
          updateFilters({ pending_adjustments: value || undefined })
        }
        onCreateClick={() => setIsModalOpen(true)}
      />

      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando movimientos...</p>
      ) : (
        <InventoryMovementsTable
          movements={movements}
          onApprove={handleApprove}
          onReject={handleReject}
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

      {isModalOpen && (
        <InventoryMovementFormModal
          availableSupplies={supplies}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
