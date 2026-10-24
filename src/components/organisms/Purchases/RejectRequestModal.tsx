import { useState } from 'react'
import { Modal } from '@/components/molecules/Modal'
import { Button } from '@/components/atoms/Button'
import type { PurchaseRequest, RejectPurchaseRequestPayload } from '@/types/purchase'
import styles from './ApproveRequestModal.module.css'

interface RejectRequestModalProps {
  request: PurchaseRequest
  onClose: () => void
  onReject: (payload: RejectPurchaseRequestPayload) => Promise<void>
}

export function RejectRequestModal({ request, onClose, onReject }: RejectRequestModalProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onReject({ reason: reason.trim() || undefined })
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al rechazar la solicitud de compra.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Rechazar Solicitud #${request.id}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>
          ¿Estás seguro de que deseas rechazar esta solicitud de compra? La solicitud quedará cerrada y no se generará ninguna orden de compra a proveedores.
        </p>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="rejectReason">
            Motivo u Observaciones del Rechazo (Opcional)
          </label>
          <textarea
            id="rejectReason"
            rows={3}
            className={styles.input}
            placeholder="Ej. Se verificó stock suficiente en almacén..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="accent" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Rechazando...' : 'Rechazar sin Comprar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
