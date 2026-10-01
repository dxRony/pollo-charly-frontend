import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import type { CancelOrderPayload, Order } from '@/types/order'
import styles from './CancelOrderModal.module.css'

interface CancelOrderModalProps {
  order: Order
  onClose: () => void
  onConfirm: (payload: CancelOrderPayload) => Promise<void>
}

export function CancelOrderModal({ order, onClose, onConfirm }: CancelOrderModalProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onConfirm(reason.trim() ? { cancellation_reason: reason.trim() } : {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cancelar la comanda.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Cancelar comanda ${order.code}`} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.warning}>
          Esta acción anulará la comanda y liberará los insumos reservados
          {order.table ? ` y la Mesa ${order.table.number}` : ''}. No se puede deshacer.
        </p>
        <TextareaField
          id="cancellation_reason"
          label="Motivo de la cancelación (opcional)"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          placeholder="Ej. el cliente cambió de opinión"
        />
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Volver
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Cancelando...' : 'Confirmar cancelación'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
