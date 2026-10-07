import { useState } from 'react'
import { Modal } from '@/components/molecules/Modal'
import { Button } from '@/components/atoms/Button'
import type { CreatePurchaseOrderPayload } from '@/types/purchase'
import type { Supplier } from '@/types/supplier'
import type { Supply } from '@/types/supply'
import styles from './ApproveRequestModal.module.css'

interface ManualPurchaseModalProps {
  suppliers: Supplier[]
  supplies: Supply[]
  onClose: () => void
  onSubmit: (payload: CreatePurchaseOrderPayload) => Promise<void>
}

interface PurchaseItemRow {
  supply_id: number | ''
  ordered_quantity: number
  unit_price: number
}

export function ManualPurchaseModal({
  suppliers,
  supplies,
  onClose,
  onSubmit,
}: ManualPurchaseModalProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | ''>(
    suppliers.length > 0 ? suppliers[0].id : '',
  )
  const [expectedDate, setExpectedDate] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [items, setItems] = useState<PurchaseItemRow[]>([
    {
      supply_id: supplies.length > 0 ? supplies[0].id : '',
      ordered_quantity: 1,
      unit_price: supplies.length > 0 ? Number(supplies[0].unit_cost ?? 0) : 0,
    },
  ])

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      {
        supply_id: supplies.length > 0 ? supplies[0].id : '',
        ordered_quantity: 1,
        unit_price: supplies.length > 0 ? Number(supplies[0].unit_cost ?? 0) : 0,
      },
    ])
  }

  function handleRemoveItem(index: number) {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSupplyChange(index: number, newSupplyId: number) {
    const supply = supplies.find((s) => s.id === newSupplyId)
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = {
        ...copy[index],
        supply_id: newSupplyId,
        unit_price: supply ? Number(supply.unit_cost ?? 0) : 0,
      }
      return copy
    })
  }

  function handleQuantityChange(index: number, val: number) {
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], ordered_quantity: Math.max(0.01, val) }
      return copy
    })
  }

  function handlePriceChange(index: number, val: number) {
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], unit_price: Math.max(0, val) }
      return copy
    })
  }

  const totalCalculated = items.reduce((acc, it) => acc + it.ordered_quantity * it.unit_price, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSupplierId) {
      setErrorMessage('Debe seleccionar un proveedor.')
      return
    }

    if (items.some((it) => !it.supply_id || it.ordered_quantity <= 0)) {
      setErrorMessage('Todos los insumos deben estar seleccionados con cantidades válidas mayores a 0.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onSubmit({
        supplier_id: Number(selectedSupplierId),
        expected_date: expectedDate || undefined,
        items: items.map((it) => ({
          supply_id: Number(it.supply_id),
          ordered_quantity: it.ordered_quantity,
          unit_price: it.unit_price,
        })),
      })
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al registrar la compra manual.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar Compra Manual" onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.section}>
          <label className={styles.label} htmlFor="manualSupplier">
            Proveedor *
          </label>
          <select
            id="manualSupplier"
            className={styles.select}
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
            required
          >
            <option value="">Seleccione un proveedor...</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.company_name} {s.contact_name ? `(${s.contact_name})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="manualExpectedDate">
            Fecha Prevista de Entrega
          </label>
          <input
            id="manualExpectedDate"
            type="date"
            className={styles.input}
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.label}>Productos a Comprar</span>
            <Button type="button" size="sm" variant="accent" onClick={handleAddItem}>
              + Agregar Insumo
            </Button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Precio Unit. ($)</th>
                  <th>Subtotal ($)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const subtotal = item.ordered_quantity * item.unit_price
                  return (
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
                          value={item.ordered_quantity}
                          onChange={(e) => handleQuantityChange(idx, parseFloat(e.target.value) || 0)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          className={styles.numberInput}
                          value={item.unit_price}
                          onChange={(e) => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                          required
                        />
                      </td>
                      <td>${subtotal.toFixed(2)}</td>
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
                            title="Eliminar fila"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.totalRow}>
          <span>Total de la Compra:</span>
          <span className={styles.totalAmount}>${totalCalculated.toFixed(2)}</span>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="accent" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Compra'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
