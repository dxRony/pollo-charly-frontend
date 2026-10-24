import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { InventoryMovementsFilterBar } from '@/components/organisms/InventoryMovementsFilterBar'
import { InventoryMovementsTable } from '@/components/organisms/InventoryMovementsTable'
import { InventoryMovementFormModal } from '@/components/organisms/InventoryMovementFormModal'
import { ReviewAdjustmentModal } from '@/components/organisms/ReviewAdjustmentModal'
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
  const [movementToReview, setMovementToReview] = useState<InventoryMovement | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const isAdmin = currentUser?.role?.name === 'Administrador'

  async function handleFormSubmit(payload: CreateInventoryMovementPayload) {
    setActionError(null)
    setFeedback(null)
    const { movement } = await inventoryMovementService.createInventoryMovement(payload)

    if (payload.type === 'ajuste') {
      if (isAdmin) {
        try {
          await inventoryMovementService.approveAdjustment(movement.id)
          setFeedback('Ajuste de inventario registrado y aprobado exitosamente.')
        } catch (err) {
          setActionError(extractErrorMessage(err))
        }
      } else {
        setFeedback(
          'Solicitud de ajuste de inventario registrada con éxito. Se ha enviado una alerta a la administradora para su revisión y aprobación.'
        )
      }
    } else {
      setFeedback('Movimiento de inventario registrado exitosamente.')
    }

    setIsModalOpen(false)
    await refetch()
    setTimeout(() => setFeedback(null), 6000)
  }

  async function handleApproveAdjustment(movementId: number, reason?: string) {
    setActionError(null)
    setFeedback(null)
    try {
      await inventoryMovementService.approveAdjustment(movementId, { reason })
      setFeedback('Ajuste de inventario aprobado y existencia actualizada exitosamente.')
      await refetch()
      setTimeout(() => setFeedback(null), 6000)
    } catch (err) {
      const msg = extractErrorMessage(err)
      setActionError(msg)
      throw new Error(msg, { cause: err })
    }
  }

  async function handleRejectAdjustment(movementId: number, reason?: string) {
    setActionError(null)
    setFeedback(null)
    try {
      await inventoryMovementService.rejectAdjustment(movementId, { reason })
      setFeedback('Ajuste de inventario rechazado exitosamente.')
      await refetch()
      setTimeout(() => setFeedback(null), 6000)
    } catch (err) {
      const msg = extractErrorMessage(err)
      setActionError(msg)
      throw new Error(msg, { cause: err })
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
      <h1 className={styles.title}>
        {isAdmin ? 'Movimientos de inventario' : 'Mis movimientos de inventario'}
      </h1>

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

      {feedback && (
        <p
          style={{
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
        >
          {feedback}
        </p>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando movimientos...</p>
      ) : (
        <InventoryMovementsTable
          movements={movements}
          onReviewAdjustment={(m) => setMovementToReview(m)}
          canReview={isAdmin}
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

      {movementToReview && (
        <ReviewAdjustmentModal
          movement={movementToReview}
          onClose={() => setMovementToReview(null)}
          onApprove={handleApproveAdjustment}
          onReject={handleRejectAdjustment}
        />
      )}
    </div>
  )
}
