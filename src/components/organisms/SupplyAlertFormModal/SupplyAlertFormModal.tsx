import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { SelectField } from '@/components/molecules/SelectField'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import type { CreateSupplyAlertPayload } from '@/types/supplyAlert'
import type { Supply } from '@/types/supply'
import styles from './SupplyAlertFormModal.module.css'

interface SupplyAlertFormModalProps {
  availableSupplies: Supply[]
  onClose: () => void
  onSubmit: (payload: CreateSupplyAlertPayload) => Promise<void>
}

export function SupplyAlertFormModal({ availableSupplies, onClose, onSubmit }: SupplyAlertFormModalProps) {
  const [supplyId, setSupplyId] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (supplyId === '') {
      setError('Debes seleccionar un insumo.')
      return
    }

    const payload: CreateSupplyAlertPayload = { supply_id: supplyId }
    if (notes.trim()) {
      payload.notes = notes.trim()
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar la alerta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Generar alerta de reposición" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <SelectField
          id="supply_id"
          label="Insumo"
          value={supplyId}
          onChange={(event) => setSupplyId(event.target.value === '' ? '' : Number(event.target.value))}
          required
        >
          <option value="">Selecciona un insumo</option>
          {availableSupplies.map((supply) => (
            <option key={supply.id} value={supply.id}>
              {supply.name} ({supply.measurement_unit?.abbreviation ?? '—'})
            </option>
          ))}
        </SelectField>
        <TextareaField
          id="notes"
          label="Notas (opcional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
        />
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Generar alerta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
