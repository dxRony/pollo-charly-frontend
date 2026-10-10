import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { SupplyAlertsFilterBar } from '@/components/organisms/SupplyAlertsFilterBar'
import { SupplyAlertsTable } from '@/components/organisms/SupplyAlertsTable'
import { SupplyAlertFormModal } from '@/components/organisms/SupplyAlertFormModal'
import { ReviewAdjustmentModal } from '@/components/organisms/ReviewAdjustmentModal'
import { useSupplyAlerts } from '@/hooks/useSupplyAlerts'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import * as supplyAlertService from '@/services/supplyAlertService'
import * as inventoryMovementService from '@/services/inventoryMovementService'
import { ApiError } from '@/services/api'
import type { CreateSupplyAlertPayload, SupplyAlert } from '@/types/supplyAlert'
import styles from './SupplyAlertsPage.module.css'

export function SupplyAlertsPage() {
  const { alerts, pagination, filters, isLoading, error, updateFilters, setPage, refetch } =
    useSupplyAlerts()
  const { supplies } = useActiveSupplies()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertToReview, setAlertToReview] = useState<SupplyAlert | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleFormSubmit(payload: CreateSupplyAlertPayload) {
    await supplyAlertService.createSupplyAlert(payload)
    setIsModalOpen(false)
    await refetch()
  }

  async function handleAttend(alert: SupplyAlert) {
    setActionError(null)
    setFeedback(null)
    try {
      await supplyAlertService.attendSupplyAlert(alert.id)
      setFeedback('Alerta atendida con éxito. Se ha generado la solicitud de compra correspondiente.')
      await refetch()
      setTimeout(() => setFeedback(null), 6000)
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setActionError(Object.values(err.errors).flat().join(' '))
      } else {
        setActionError(err instanceof Error ? err.message : 'No se pudo atender la alerta.')
      }
    }
  }

  async function handleApproveAdjustment(movementId: number, reason?: string) {
    setActionError(null)
    setFeedback(null)
    try {
      await inventoryMovementService.approveAdjustment(movementId, { reason })
      setFeedback('Ajuste de inventario aprobado y alerta atendida exitosamente.')
      await refetch()
      setTimeout(() => setFeedback(null), 6000)
    } catch (err) {
      const msg = err instanceof ApiError && err.errors
        ? Object.values(err.errors).flat().join(' ')
        : (err instanceof Error ? err.message : 'No se pudo aprobar el ajuste de inventario.')
      setActionError(msg)
      throw new Error(msg, { cause: err })
    }
  }

  async function handleRejectAdjustment(movementId: number, reason?: string) {
    setActionError(null)
    setFeedback(null)
    try {
      await inventoryMovementService.rejectAdjustment(movementId, { reason })
      setFeedback('Ajuste de inventario rechazado y alerta cerrada exitosamente.')
      await refetch()
      setTimeout(() => setFeedback(null), 6000)
    } catch (err) {
      const msg = err instanceof ApiError && err.errors
        ? Object.values(err.errors).flat().join(' ')
        : (err instanceof Error ? err.message : 'No se pudo rechazar el ajuste de inventario.')
      setActionError(msg)
      throw new Error(msg, { cause: err })
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Alertas de reposición</h1>

      <SupplyAlertsFilterBar
        search={filters.search ?? ''}
        supplyId={filters.supply_id ?? ''}
        origin={filters.origin ?? ''}
        status={filters.status ?? ''}
        supplies={supplies}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onSupplyChange={(value) => updateFilters({ supply_id: value === '' ? undefined : value })}
        onOriginChange={(value) => updateFilters({ origin: value === '' ? undefined : value })}
        onStatusChange={(value) => updateFilters({ status: value === '' ? undefined : value })}
        onCreateClick={() => setIsModalOpen(true)}
      />

      {feedback && <p style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>{feedback}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando alertas...</p>
      ) : (
        <SupplyAlertsTable
          alerts={alerts}
          onAttend={handleAttend}
          onReviewAdjustment={(alert) => setAlertToReview(alert)}
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
        <SupplyAlertFormModal
          availableSupplies={supplies}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {alertToReview && (
        <ReviewAdjustmentModal
          movement={
            alertToReview.inventory_movement ?? {
              id: alertToReview.inventory_movement_id ?? 0,
              supply_id: alertToReview.supply_id,
              supply: alertToReview.supply,
              inventory_movement_type_id: 4,
              movement_type: { id: 4, name: 'ajuste_inventario' },
              type: 'ajuste_inventario',
              user_id: alertToReview.user_id ?? 0,
              user: alertToReview.user,
              quantity: 0,
              previous_stock: Number(alertToReview.supply?.current_stock) || 0,
              new_stock: Number(alertToReview.supply?.current_stock) || 0,
              reason: alertToReview.notes ?? 'Solicitud de ajuste de inventario',
              order_id: null,
              order_item_id: null,
              purchase_order_id: null,
              adjustment_status_type_id: 1,
              adjustment_status: { id: 1, name: 'pendiente_aprobacion' },
              approver_user_id: null,
              approver_user: null,
              created_at: alertToReview.created_at,
            }
          }
          onClose={() => setAlertToReview(null)}
          onApprove={handleApproveAdjustment}
          onReject={handleRejectAdjustment}
        />
      )}
    </div>
  )
}
