import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import type { CreateTablePayload, RestaurantTable, UpdateTablePayload } from '@/types/restaurantTable'
import styles from './RestaurantTableFormModal.module.css'

interface RestaurantTableFormModalProps {
  mode: 'create' | 'edit'
  initialTable?: RestaurantTable
  onClose: () => void
  onSubmit: (payload: CreateTablePayload | UpdateTablePayload) => Promise<void>
}

export function RestaurantTableFormModal({
  mode,
  initialTable,
  onClose,
  onSubmit,
}: RestaurantTableFormModalProps) {
  const [number, setNumber] = useState(initialTable?.number.toString() ?? '')
  const [capacity, setCapacity] = useState(initialTable?.capacity.toString() ?? '4')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = mode === 'create' ? 'Registrar nueva mesa' : 'Editar mesa'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const payload: CreateTablePayload | UpdateTablePayload = {
      number: Number(number),
      capacity: Number(capacity),
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la mesa.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          id="number"
          label="Número de mesa"
          type="number"
          step="1"
          min="1"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          required
        />
        <FormField
          id="capacity"
          label="Capacidad (personas)"
          type="number"
          step="1"
          min="1"
          max="50"
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          required
        />
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
