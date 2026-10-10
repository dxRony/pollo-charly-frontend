import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import type { InventoryMovement } from '@/types/inventoryMovement'
import styles from './ReviewAdjustmentModal.module.css'

interface ReviewAdjustmentModalProps {
  movement: InventoryMovement
  onClose: () => void
  onApprove: (movementId: number, reason?: string) => Promise<void>
  onReject: (movementId: number, reason?: string) => Promise<void>
}

export function ReviewAdjustmentModal({
  movement,
  onClose,
  onApprove,
  onReject,
}: ReviewAdjustmentModalProps) {
  const [reviewReason, setReviewReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prevStock = Number(movement.previous_stock) || 0
  const nextStock = Number(movement.new_stock) || 0
  const diff = nextStock - prevStock
  const unit = movement.supply?.measurement_unit?.abbreviation ?? ''

  async function handleApproveClick() {
    setError(null)
    setIsSubmitting(true)
    try {
      await onApprove(movement.id, reviewReason.trim() || undefined)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar el ajuste.')
      setIsSubmitting(false)
    }
  }

  async function handleRejectClick() {
    setError(null)
    setIsSubmitting(true)
    try {
      await onReject(movement.id, reviewReason.trim() || undefined)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar el ajuste.')
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Detalle de solicitud de ajuste de inventario" onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Producto / Insumo</span>
            <span className={styles.value}>
              {movement.supply?.name ?? '—'}
              {movement.supply?.code && ` (${movement.supply.code})`}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Solicitado por</span>
            <span className={styles.value}>
              {movement.user?.name ?? '—'}
              {movement.user?.role && ` · ${movement.user.role}`}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Fecha y hora</span>
            <span className={styles.value}>
              {new Date(movement.created_at).toLocaleString()}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Unidad de medida</span>
            <span className={styles.value}>
              {movement.supply?.measurement_unit?.name ?? unit ?? '—'}
            </span>
          </div>
        </div>

        <div className={styles.stockBox}>
          <div className={styles.stockStat}>
            <span className={styles.stockLabel}>Stock anterior</span>
            <span className={styles.stockValue}>
              {prevStock.toFixed(2)} {unit}
            </span>
          </div>

          <div className={styles.stockStat}>
            <span className={styles.stockLabel}>Stock solicitado</span>
            <span className={styles.stockValue}>
              {nextStock.toFixed(2)} {unit}
            </span>
          </div>

          <div className={styles.stockStat}>
            <span className={styles.stockLabel}>Diferencia neta</span>
            <span
              className={`${styles.stockValue} ${
                diff > 0 ? styles.diffPositive : diff < 0 ? styles.diffNegative : ''
              }`}
            >
              {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} {unit}
            </span>
          </div>
        </div>

        <div className={styles.reasonBox}>
          <span className={styles.reasonTitle}>Motivo indicado por el usuario:</span>
          <p className={styles.reasonText}>
            {movement.reason || 'Sin motivo especificado'}
          </p>
        </div>

        <div className={styles.reviewSection}>
          <TextareaField
            id="reviewReason"
            label="Observación o motivo de revisión (opcional)"
            value={reviewReason}
            onChange={(e) => setReviewReason(e.target.value)}
            rows={2}
            placeholder="Ej. Conteo verificado físicamente en almacén / Justificación insuficiente..."
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cerrar
          </Button>
          <button
            type="button"
            className={styles.rejectButton}
            onClick={handleRejectClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Rechazar ajuste'}
          </button>
          <Button
            type="button"
            variant="primary"
            onClick={handleApproveClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Aprobar ajuste'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
