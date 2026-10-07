import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Modal } from '@/components/molecules/Modal'
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
  const [hasIncident, setHasIncident] = useState(false)
  const [incidentTypeId, setIncidentTypeId] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')

  // Insumos provistos por el proveedor para registrar cantidades
  const [items, setItems] = useState<ItemRow[]>(
    supplier.supplies?.map((s) => ({
      supply_id: s.supply_id,
      name: s.name,
      received_quantity: '',
      unit_price: s.agreed_price,
      measurement_unit: s.measurement_unit,
    })) ?? [],
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleQuantityChange(index: number, value: string) {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], received_quantity: value }
      return updated
    })
  }

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

        {/* Insumos recibidos (opcional) */}
        {items.length > 0 && (
          <div className={styles.itemsSection}>
            <div className={styles.itemsTitle}>Cantidades recibidas (opcional):</div>
            <div className={styles.itemsGrid}>
              {items.map((it, idx) => (
                <div key={it.supply_id} className={styles.itemRow}>
                  <span className={styles.itemName}>{it.name}</span>
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
                </div>
              ))}
            </div>
          </div>
        )}

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
