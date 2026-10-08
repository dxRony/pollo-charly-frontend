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
  const isCorrected = order.status === 'recibida_con_incidencia'
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

  const modalTitle = isCorrected
    ? `Revisar y Recibir Entrega Corregida: ${order.code}`
    : `Confirmar Recepción Conforme: ${order.code}`

  return (
    <Modal title={modalTitle} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {isCorrected ? (
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', color: '#92400e' }}>
            <p style={{ margin: 0 }}>
              <strong>Proveedor corrigió o repuso los productos:</strong> Al confirmar la recepción conforme de la entrega corregida, el sistema dará por recibida completa la orden, actualizará las existencias en almacén, registrará el movimiento de inventario (<strong>compra_entrada</strong>) y resolverá las incidencias abiertas asociadas.
            </p>
          </div>
        ) : (
          <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>
            Verifique la cantidad, peso y calidad de los insumos entregados. Al confirmar la recepción conforme, se ingresarán automáticamente los insumos al almacén sumando sus existencias y registrando el movimiento de inventario (<strong>compra_entrada</strong>).
          </p>
        )}

        <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
          <p><strong>Proveedor:</strong> {order.supplier_name ?? `ID #${order.supplier_id}`}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Ítems a recibir:</strong> {order.items?.length ?? 0} insumos</p>
        </div>

        {order.items && order.items.length > 0 && (
          <div className={styles.section}>
            <label className={styles.label}>Productos a verificar en entrega</label>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Insumo</th>
                    <th>Cantidad Solicitada</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.supply_name ?? `Insumo #${item.supply_id}`}</strong></td>
                      <td>{item.ordered_quantity} {item.measurement_unit ?? ''}</td>
                      <td>${item.unit_price.toFixed(2)}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
            Observaciones de la Recepción
          </label>
          <textarea
            id="receiveNotes"
            rows={2}
            className={styles.input}
            placeholder={
              isCorrected
                ? 'Proveedor repuso productos faltantes/corregidos en óptimas condiciones...'
                : 'Mercancía verificada y entregada en perfecto estado...'
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="accent" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Procesando...'
              : isCorrected
                ? 'Confirmar Entrega Corregida y Actualizar Stock'
                : 'Confirmar Recepción y Actualizar Stock'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
