import { useEffect, useState } from 'react'
import { Modal } from '@/components/molecules/Modal'
import { Button } from '@/components/atoms/Button'
import { getDeliveryIncidentTypes } from '@/services/supplierService'
import type { DeliveryIncidentType } from '@/types/supplier'
import type { PurchaseOrder, ReportOrderIncidentPayload } from '@/types/purchase'
import styles from './ApproveRequestModal.module.css'

interface ReportIncidentModalProps {
  order: PurchaseOrder
  onClose: () => void
  onReport: (payload: ReportOrderIncidentPayload) => Promise<void>
}

const DEFAULT_INCIDENT_TYPES: DeliveryIncidentType[] = [
  { id: 1, name: 'retraso' },
  { id: 2, name: 'diferencia_peso' },
  { id: 3, name: 'problema_calidad' },
  { id: 4, name: 'producto_incompleto' },
]

function formatTypeName(name: string): string {
  switch (name) {
    case 'retraso':
      return 'Retraso en la entrega'
    case 'diferencia_peso':
      return 'Diferencia de peso'
    case 'problema_calidad':
      return 'Problema de calidad o estado del producto'
    case 'producto_incompleto':
      return 'Faltante de producto o cantidad'
    default:
      return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }
}

export function ReportIncidentModal({ order, onClose, onReport }: ReportIncidentModalProps) {
  const [incidentTypes, setIncidentTypes] = useState<DeliveryIncidentType[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [evidencePath, setEvidencePath] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    getDeliveryIncidentTypes()
      .then((res) => {
        if (isMounted) {
          const list = res.data.length > 0 ? res.data : DEFAULT_INCIDENT_TYPES
          setIncidentTypes(list)
          if (list.length > 0) {
            setSelectedTypeId(list[0].id)
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setIncidentTypes(DEFAULT_INCIDENT_TYPES)
          setSelectedTypeId(DEFAULT_INCIDENT_TYPES[0].id)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedTypeId) {
      setErrorMessage('Selecciona un tipo de incidencia.')
      return
    }

    if (!description.trim()) {
      setErrorMessage('Ingresa la descripción o motivo de la no conformidad.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await onReport({
        delivery_incident_type_id: Number(selectedTypeId),
        description: description.trim(),
        evidence_path: evidencePath.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al registrar la incidencia de entrega.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Reportar Incidencia en Entrega: ${order.code}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
          Indica el motivo por el cual la entrega no es conforme (diferencia de peso, producto dañado, faltantes o retraso). La administradora recibirá una notificación inmediata por correo para gestionar la reposición o corrección con el proveedor.
        </p>

        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
          <p><strong>Orden:</strong> {order.code}</p>
          <p><strong>Proveedor:</strong> {order.supplier_name ?? `ID #${order.supplier_id}`}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        </div>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="incidentType">
            Tipo de Incidencia *
          </label>
          <select
            id="incidentType"
            className={styles.select}
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(Number(e.target.value))}
            required
          >
            {incidentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {formatTypeName(type.name)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="incidentDescription">
            Descripción y Motivo de la Incidencia *
          </label>
          <textarea
            id="incidentDescription"
            rows={3}
            className={styles.input}
            placeholder="Ej: Se identificó una diferencia de peso de 2 kg respecto a lo solicitado en la orden..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label} htmlFor="incidentEvidence">
            Enlace o Evidencia Fotográfica (Opcional)
          </label>
          <input
            id="incidentEvidence"
            type="url"
            className={styles.input}
            placeholder="https://ejemplo.com/evidencia.jpg"
            value={evidencePath}
            onChange={(e) => setEvidencePath(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="accent" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Incidencia y Notificar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
