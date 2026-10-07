import { useState } from 'react'
import { Modal } from '@/components/molecules/Modal'
import { Button } from '@/components/atoms/Button'
import type { PurchaseOrder, ReceivePurchaseOrderPayload } from '@/types/purchase'
import styles from './ApproveRequestModal.module.css'

interface ConfirmReceiveModalProps {
  order: PurchaseOrder
  onClose: () => void
  onConfirm: (payload: ReceivePurchaseOrderPayload) => Promise<void>
}

export function ConfirmReceiveModal({ order, onClose, onConfirm }: ConfirmReceiveModalProps) {
  const [receivedDate, setReceivedDate] = useState<string>(
    new Date().toISOString().substring(0, 10),
  )
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onConfirm({
        received_date: receivedDate || undefined,
        notes: notes.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al confirmar la recepción de la compra.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Confirmar Recepción de Compra: ${order.code}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>
          Al confirmar la recepción, se ingresarán automáticamente los insumos al almacén sumando sus existencias y registrando el movimiento de inventario de tipo <strong>compra_entrada</strong>.
        </p>

        <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
          <p><strong>Proveedor:</strong> {order.supplier_name ?? `ID #${order.supplier_id}`}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Productos:</strong> {order.items?.length ?? 0} ítems</p>
        </div>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="receiveDate">
            Fecha de Recepción Conforme *
          </label>
          <input
            id="receiveDate"
            type="date"
            className={styles.input}
            value={receivedDate}
            onChange={(e) => setReceivedDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="receiveNotes">
            Observaciones o Notas de Entrega
          </label>
          <textarea
            id="receiveNotes"
            rows={2}
            className={styles.input}
            placeholder="Mercancía entregada en perfecto estado..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="accent" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : 'Confirmar Recepción y Actualizar Stock'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
