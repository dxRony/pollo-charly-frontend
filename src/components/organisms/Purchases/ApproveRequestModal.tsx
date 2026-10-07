import { useState } from 'react'
import { Modal } from '@/components/molecules/Modal'
import { Button } from '@/components/atoms/Button'
import type { ApprovePurchaseRequestPayload, PurchaseRequest } from '@/types/purchase'
import type { Supplier } from '@/types/supplier'
import styles from './ApproveRequestModal.module.css'

interface ApproveRequestModalProps {
  request: PurchaseRequest
  suppliers: Supplier[]
  onClose: () => void
  onApprove: (payload: ApprovePurchaseRequestPayload) => Promise<void>
}

interface ItemRowState {
  supply_id: number
  supply_name: string
  measurement_unit: string
  suggested_quantity: number
  quantity: number
  unit_price: number
}

export function ApproveRequestModal({
  request,
  suppliers,
  onClose,
  onApprove,
}: ApproveRequestModalProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | ''>(
    suppliers.length > 0 ? suppliers[0].id : '',
  )
  const [expectedDate, setExpectedDate] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [items, setItems] = useState<ItemRowState[]>(() => {
    return (
      request.items?.map((item) => ({
        supply_id: item.supply_id,
        supply_name: item.supply_name ?? `Insumo #${item.supply_id}`,
        measurement_unit: item.measurement_unit ?? 'uds',
        suggested_quantity: item.suggested_quantity,
        quantity: item.suggested_quantity,
        unit_price: item.current_unit_cost ?? 0,
      })) ?? []
    )
  })

  // Handle supplier change: if supplier has agreed prices for these supplies, prefill them
  function handleSupplierChange(newSupplierId: number) {
    setSelectedSupplierId(newSupplierId)
    const supplier = suppliers.find((s) => s.id === newSupplierId)
    if (!supplier || !supplier.supplies) return

    setItems((prevItems) =>
      prevItems.map((item) => {
        const matchingSupply = supplier.supplies?.find((s) => s.id === item.supply_id)
        if (matchingSupply && matchingSupply.agreed_price) {
          return { ...item, unit_price: Number(matchingSupply.agreed_price) }
        }
        return item
      }),
    )
  }

  function handleQuantityChange(index: number, val: number) {
    setItems((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], quantity: Math.max(0.01, val) }
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

  const totalCalculated = items.reduce((acc, it) => acc + it.quantity * it.unit_price, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSupplierId) {
      setErrorMessage('Debe seleccionar un proveedor para generar la orden de compra.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onApprove({
        supplier_id: Number(selectedSupplierId),
        expected_date: expectedDate || undefined,
        items: items.map((it) => ({
          supply_id: it.supply_id,
          quantity: it.quantity,
          unit_price: it.unit_price,
        })),
      })
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al aprobar la solicitud de compra.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Aprobar Solicitud #${request.id}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.section}>
          <label className={styles.label} htmlFor="supplierSelect">
            Proveedor *
          </label>
          <select
            id="supplierSelect"
            className={styles.select}
            value={selectedSupplierId}
            onChange={(e) => handleSupplierChange(Number(e.target.value))}
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
          <label className={styles.label} htmlFor="expectedDate">
            Fecha Prevista de Entrega
          </label>
          <input
            id="expectedDate"
            type="date"
            className={styles.input}
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <span className={styles.label}>Insumos y Cantidades a Ordenar</span>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Sugerido</th>
                  <th>Aprobar Cantidad</th>
                  <th>Precio Unit. ($)</th>
                  <th>Subtotal ($)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const subtotal = item.quantity * item.unit_price
                  return (
                    <tr key={item.supply_id}>
                      <td>
                        <strong>{item.supply_name}</strong>
                      </td>
                      <td>
                        {item.suggested_quantity} {item.measurement_unit}
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          className={styles.numberInput}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(idx, parseFloat(e.target.value) || 0)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={styles.numberInput}
                          value={item.unit_price}
                          onChange={(e) => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                          required
                        />
                      </td>
                      <td>${subtotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.totalRow}>
          <span>Total de la Orden de Compra:</span>
          <span className={styles.totalAmount}>${totalCalculated.toFixed(2)}</span>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="accent" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Aprobando...' : 'Aprobar y Generar Orden'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
