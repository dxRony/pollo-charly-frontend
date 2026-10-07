import { useState } from 'react'
import { Modal } from '@/components/molecules/Modal'
import { Button } from '@/components/atoms/Button'
import type { CreatePurchaseRequestPayload } from '@/types/purchase'
import type { Supply } from '@/types/supply'
import styles from './ApproveRequestModal.module.css'

interface CreateRequestModalProps {
  supplies: Supply[]
  onClose: () => void
  onSubmit: (payload: CreatePurchaseRequestPayload) => Promise<void>
}

interface RequestItemRow {
  supply_id: number | ''
  suggested_quantity: number
}

export function CreateRequestModal({ supplies, onClose, onSubmit }: CreateRequestModalProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [items, setItems] = useState<RequestItemRow[]>([
    {
      supply_id: supplies.length > 0 ? supplies[0].id : '',
      suggested_quantity: 10,
    },
  ])

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      {
        supply_id: supplies.length > 0 ? supplies[0].id : '',
        suggested_quantity: 10,
      },
    ])
  }

  function handleRemoveItem(index: number) {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSupplyChange(index: number, newSupplyId: number) {
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], supply_id: newSupplyId }
      return copy
    })
  }

  function handleQuantityChange(index: number, val: number) {
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], suggested_quantity: Math.max(0.01, val) }
      return copy
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.some((it) => !it.supply_id || it.suggested_quantity <= 0)) {
      setErrorMessage('Todos los insumos deben estar seleccionados con cantidades válidas mayores a 0.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onSubmit({
        reason: reason.trim() || undefined,
        items: items.map((it) => ({
          supply_id: Number(it.supply_id),
          suggested_quantity: it.suggested_quantity,
        })),
      })
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al crear la solicitud de compra.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Nueva Solicitud de Compra" onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.section}>
          <label className={styles.label} htmlFor="requestReason">
            Motivo u Observaciones de la Solicitud
          </label>
          <textarea
            id="requestReason"
            rows={2}
            className={styles.input}
            placeholder="Ej. Abastecimiento de insumos para fin de semana..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.label}>Insumos y Cantidades Sugeridas</span>
            <Button type="button" size="sm" variant="accent" onClick={handleAddItem}>
              + Agregar Insumo
            </Button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cantidad Sugerida</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <select
                        className={styles.select}
                        value={item.supply_id}
                        onChange={(e) => handleSupplyChange(idx, Number(e.target.value))}
                        required
                      >
                        {supplies.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.measurement_unit?.name ?? 'uds'})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className={styles.numberInput}
                        value={item.suggested_quantity}
                        onChange={(e) => handleQuantityChange(idx, parseFloat(e.target.value) || 0)}
                        required
                      />
                    </td>
                    <td>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="accent" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Solicitud'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
