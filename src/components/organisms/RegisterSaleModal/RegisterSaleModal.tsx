import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { SelectField } from '@/components/molecules/SelectField'
import { Modal } from '@/components/molecules/Modal'
import { formatOrderError } from '@/utils/formatOrderError'
import { PAYMENT_METHOD_OPTIONS, RECEIPT_TYPE_OPTIONS } from '@/types/sale'
import type { PaymentMethodAlias, ReceiptTypeAlias, RegisterSalePayload } from '@/types/sale'
import type { Order } from '@/types/order'
import styles from './RegisterSaleModal.module.css'

interface RegisterSaleModalProps {
  order: Order
  onClose: () => void
  onSubmit: (payload: RegisterSalePayload) => Promise<void>
}

export function RegisterSaleModal({ order, onClose, onSubmit }: RegisterSaleModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodAlias>('efectivo')
  const [receiptType, setReceiptType] = useState<ReceiptTypeAlias>('ticket')
  const [receivedAmount, setReceivedAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCash = paymentMethod === 'efectivo'
  const receivedValue = Number(receivedAmount)
  const hasValidReceived = receivedAmount.trim() !== '' && !Number.isNaN(receivedValue)
  const change = hasValidReceived ? Math.round((receivedValue - order.total) * 100) / 100 : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const payload: RegisterSalePayload = {
      payment_method: paymentMethod,
      receipt_type: receiptType,
    }

    if (isCash) {
      if (!hasValidReceived || receivedValue < order.total) {
        setError('El monto recibido debe ser mayor o igual al total de la comanda.')
        return
      }
      payload.received_amount = receivedValue
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(formatOrderError(err, 'No se pudo registrar la venta.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Cobrar comanda ${order.code}`} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.total}>
          Total a pagar: <strong>{order.total.toFixed(2)}</strong>
        </p>

        <SelectField
          id="payment_method"
          label="Método de pago"
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value as PaymentMethodAlias)}
          required
        >
          {PAYMENT_METHOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="receipt_type"
          label="Tipo de comprobante"
          value={receiptType}
          onChange={(event) => setReceiptType(event.target.value as ReceiptTypeAlias)}
          required
        >
          {RECEIPT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        {isCash && (
          <>
            <FormField
              id="received_amount"
              label="Monto recibido del cliente"
              type="number"
              step="0.01"
              min="0"
              value={receivedAmount}
              onChange={(event) => setReceivedAmount(event.target.value)}
              required
            />
            {change !== null && (
              <p className={change < 0 ? styles.changeInvalid : styles.change}>
                {change < 0
                  ? `Falta ${Math.abs(change).toFixed(2)} para cubrir el total.`
                  : `Vuelto: ${change.toFixed(2)}`}
              </p>
            )}
          </>
        )}

        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Confirmar venta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
