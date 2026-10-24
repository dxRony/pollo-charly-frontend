import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Modal } from '@/components/molecules/Modal'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import { useDeliveryCatalogs } from '@/hooks/useDeliveryCatalogs'
import { ApiError } from '@/services/api'
import * as supplierService from '@/services/supplierService'
import type { DeliveryItemPayload, RecordDeliveryPayload, Supplier } from '@/types/supplier'
import styles from './RecordDeliveryModal.module.css'

interface RecordDeliveryModalProps {
  supplier: Supplier
  onClose: () => void
  onSuccess: (message: string) => void
}

interface ItemRow {
  supply_id: number
  name: string
  received_quantity: string
  unit_price: number
  measurement_unit: string
}

export function RecordDeliveryModal({ supplier, onClose, onSuccess }: RecordDeliveryModalProps) {
  const { incidentTypes } = useDeliveryCatalogs()
  const { supplies: catalogSupplies } = useActiveSupplies()
  const [hasIncident, setHasIncident] = useState(false)
  const [incidentTypeId, setIncidentTypeId] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')

  // Insumos provistos por el proveedor para registrar cantidades
  const [items, setItems] = useState<ItemRow[]>(() => {
    if (supplier.supplies && supplier.supplies.length > 0) {
      return supplier.supplies.map((s) => ({
        supply_id: s.supply_id,
        name: s.name,
        received_quantity: '',
        unit_price: Number(s.agreed_price) || 0,
        measurement_unit: s.measurement_unit || 'ud',
      }))
    }
    return []
  })

  const [selectedCatalogSupplyId, setSelectedCatalogSupplyId] = useState<number | ''>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Insumos del catálogo que no están todavía en la lista
  const availableCatalogSupplies = catalogSupplies.filter(
    (cs) => !items.some((it) => it.supply_id === cs.id),
  )

  function handleQuantityChange(index: number, value: string) {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], received_quantity: value }
      return updated
    })
    if (parseFloat(value) > 0) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy.items
        delete copy[`item_${index}`]
        return copy
      })
    }
  }

  function handleAddSupplyToDelivery() {
    if (!selectedCatalogSupplyId) return
    const cs = catalogSupplies.find((s) => s.id === Number(selectedCatalogSupplyId))
    if (!cs) return
    setItems((prev) => [
      ...prev,
      {
        supply_id: cs.id,
        name: cs.name,
        received_quantity: '',
        unit_price: Number(cs.unit_cost) || 0,
        measurement_unit: cs.measurement_unit?.abbreviation || 'ud',
      },
    ])
    setSelectedCatalogSupplyId('')
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy.items
      return copy
    })
  }

  function handleRemoveItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const totalEstimated = items.reduce((sum, it) => {
    const qty = parseFloat(it.received_quantity)
    if (!isNaN(qty) && qty > 0) {
      return sum + qty * it.unit_price
    }
    return sum
  }, 0)

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (hasIncident) {
      if (!incidentTypeId) {
        newErrors.incidentTypeId = 'Debe seleccionar el tipo de incidencia identificado.'
      }
      if (!description.trim()) {
        newErrors.description = 'Debe ingresar una descripción detallada de la anomalía observada.'
      } else if (description.trim().length < 5) {
        newErrors.description = 'La descripción debe tener al menos 5 caracteres.'
      }
    }

    const hasAtLeastOneItem = items.some((it) => {
      const q = parseFloat(it.received_quantity)
      return !isNaN(q) && q > 0
    })

    if (!hasAtLeastOneItem) {
      newErrors.items = 'Debe ingresar la cantidad recibida de al menos un producto (mayor a 0).'
    }

    items.forEach((it, idx) => {
      if (it.received_quantity.trim() !== '') {
        const q = parseFloat(it.received_quantity)
        if (isNaN(q) || q < 0) {
          newErrors[`item_${idx}`] = 'La cantidad debe ser un valor positivo.'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setGeneralError(null)

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    const formattedItems: DeliveryItemPayload[] = items
      .filter((it) => parseFloat(it.received_quantity) > 0)
      .map((it) => ({
        supply_id: it.supply_id,
        received_quantity: parseFloat(it.received_quantity),
        unit_price: it.unit_price,
      }))

    const payload: RecordDeliveryPayload = {
      has_incident: hasIncident,
      delivery_incident_type_id: hasIncident ? Number(incidentTypeId) : undefined,
      description: hasIncident ? description.trim() : undefined,
      notes: notes.trim() || undefined,
      items: formattedItems.length > 0 ? formattedItems : undefined,
    }

    try {
      const response = await supplierService.recordDelivery(supplier.id, payload)
      onSuccess(response.message)
      onClose()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.errors) {
        const backendErrors: Record<string, string> = {}
        Object.entries(err.errors).forEach(([field, msgs]) => {
          backendErrors[field] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
        setErrors(backendErrors)
      } else {
        setGeneralError(err instanceof Error ? err.message : 'Error al registrar la entrega.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Recepción de Entrega: ${supplier.company_name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {generalError && <div className={styles.alertDanger}>{generalError}</div>}

        <p className={styles.leadText}>
          Registra la recepción física de mercancía del proveedor. Revisa el estado de la carga, empaques y peso.
        </p>

        {/* Selector de Estado de la Entrega */}
        <div className={styles.incidentSelector}>
          <label
            className={`${styles.radioOption} ${!hasIncident ? styles.radioOptionSuccess : ''}`}
          >
            <input
              type="radio"
              name="deliveryCondition"
              checked={!hasIncident}
              onChange={() => {
                setHasIncident(false)
                setErrors({})
              }}
            />
            <div>
              <div className={styles.radioTitle}>✓ Entrega Conforme (Sin Incidencias)</div>
              <div className={styles.radioDesc}>
                El pedido llegó completo, a tiempo y en óptimas condiciones de calidad y refrigeración.
              </div>
            </div>
          </label>

          <label
            className={`${styles.radioOption} ${hasIncident ? styles.radioOptionDanger : ''}`}
          >
            <input
              type="radio"
              name="deliveryCondition"
              checked={hasIncident}
              onChange={() => {
                setHasIncident(true)
                if (incidentTypes.length > 0 && !incidentTypeId) {
                  setIncidentTypeId(incidentTypes[0].id)
                }
              }}
            />
            <div>
              <div className={styles.radioTitle}>⚠️ Registrar Incidencia / Anomalía</div>
              <div className={styles.radioDesc}>
                Se detectó una diferencia de peso, producto en mal estado, daño en empaque o retraso en la entrega.
              </div>
            </div>
          </label>
        </div>

        {/* Sección de Incidencia si hasIncident es true */}
        {hasIncident && (
          <div className={styles.incidentDetailsBox}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Tipo de Incidencia *</label>
              <select
                className={styles.select}
                value={incidentTypeId}
                onChange={(e) => setIncidentTypeId(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">Seleccione el tipo de anomalía...</option>
                {incidentTypes.map((type) => {
                  const label =
                    type.name === 'peso_incompleto'
                      ? 'Diferencia de peso / Peso incompleto'
                      : type.name === 'producto_danado'
                        ? 'Problema de calidad / Producto dañado o descompuesto'
                        : type.name === 'retraso'
                          ? 'Retraso en la hora pactada'
                          : type.name === 'producto_equivocado'
                            ? 'Producto equivocado o no solicitado'
                            : type.name
                  return (
                    <option key={type.id} value={type.id}>
                      {label}
                    </option>
                  )
                })}
              </select>
              {errors.incidentTypeId && (
                <span className={styles.errorText}>{errors.incidentTypeId}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Descripción de la Incidencia *</label>
              <textarea
                className={styles.textarea}
                rows={3}
                placeholder="Detalla qué ocurrió (ej: Faltaron 4 kg de pechuga, empaque roto, retraso de 2 horas sin aviso previo)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <span className={styles.errorText}>{errors.description}</span>
              )}
            </div>
          </div>
        )}

        {/* Insumos recibidos */}
        <div className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            <div>
              <div className={styles.itemsTitle}>Productos e insumos recibidos *</div>
              <div className={styles.itemsSubtitle}>
                Ingrese las cantidades físicas recibidas de la mercancía.
              </div>
            </div>
            {availableCatalogSupplies.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <select
                  className={styles.select}
                  style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                  value={selectedCatalogSupplyId}
                  onChange={(e) =>
                    setSelectedCatalogSupplyId(e.target.value === '' ? '' : Number(e.target.value))
                  }
                >
                  <option value="">+ Seleccionar otro producto...</option>
                  {availableCatalogSupplies.map((cs) => (
                    <option key={cs.id} value={cs.id}>
                      {cs.name} ({cs.measurement_unit?.abbreviation ?? 'ud'}) - Q{Number(cs.unit_cost ?? 0).toFixed(2)}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSupplyToDelivery}
                  disabled={!selectedCatalogSupplyId}
                >
                  Agregar
                </Button>
              </div>
            )}
          </div>

          {errors.items && <span className={styles.errorText}>{errors.items}</span>}

          {items.length === 0 ? (
            <p className={styles.leadText} style={{ fontStyle: 'italic', margin: '0.5rem 0' }}>
              Este proveedor no tiene insumos predeterminados. Seleccione uno arriba para registrar la recepción.
            </p>
          ) : (
            <>
              <div className={styles.tableHeader}>
                <span>Producto</span>
                <span>P. Unitario</span>
                <span>Cantidad Recibida *</span>
                <span style={{ textAlign: 'right' }}>Subtotal</span>
                <span></span>
              </div>
              <div className={styles.itemsGrid}>
                {items.map((it, idx) => {
                  const qtyNum = parseFloat(it.received_quantity) || 0
                  const subtotal = qtyNum * it.unit_price
                  const itemErr = errors[`item_${idx}`]

                  return (
                    <div key={it.supply_id} className={styles.itemRow}>
                      <span className={styles.itemName} title={it.name}>
                        {it.name}
                      </span>
                      <span className={styles.itemPrice}>Q{it.unit_price.toFixed(2)}</span>
                      <div>
                        <div className={styles.itemQtyWrapper}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className={styles.itemInput}
                            placeholder="0.00"
                            value={it.received_quantity}
                            onChange={(e) => handleQuantityChange(idx, e.target.value)}
                          />
                          <span className={styles.itemUnit}>{it.measurement_unit}</span>
                        </div>
                        {itemErr && <span className={styles.errorText}>{itemErr}</span>}
                      </div>
                      <span className={styles.itemSubtotal}>Q{subtotal.toFixed(2)}</span>
                      <button
                        type="button"
                        className={styles.removeItemBtn}
                        onClick={() => handleRemoveItem(idx)}
                        title="Quitar de esta entrega"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className={styles.totalBanner}>
                <span className={styles.totalLabel}>Total estimado de la entrega:</span>
                <span className={styles.totalAmount}>Q{totalEstimated.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Notas adicionales */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Notas adicionales / Observaciones:</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Ej: Conductor de camión firmó acta; comprobante de remisión adjunto"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Procesando entrega...'
              : hasIncident
                ? 'Registrar Entrega con Incidencia'
                : 'Confirmar Entrega Conforme'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
