import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import { SupplyQuantityPicker, type SupplyQuantityLine } from '@/components/organisms/SupplyQuantityPicker'
import type { Supply } from '@/types/supply'
import type {
  Complement,
  ComplementSupplyInput,
  CreateComplementPayload,
  UpdateComplementPayload,
} from '@/types/complement'
import styles from './ComplementFormModal.module.css'

interface ComplementFormModalProps {
  mode: 'create' | 'edit'
  availableSupplies: Supply[]
  initialComplement?: Complement
  onClose: () => void
  onSubmit: (payload: CreateComplementPayload | UpdateComplementPayload) => Promise<void>
}

export function ComplementFormModal({
  mode,
  availableSupplies,
  initialComplement,
  onClose,
  onSubmit,
}: ComplementFormModalProps) {
  const [name, setName] = useState(initialComplement?.name ?? '')
  const [description, setDescription] = useState(initialComplement?.description ?? '')
  const [extraPrice, setExtraPrice] = useState(initialComplement?.extra_price.toString() ?? '')
  const [supplyLines, setSupplyLines] = useState<SupplyQuantityLine[]>(
    initialComplement?.supplies.map((line) => ({
      supply_id: line.supply_id,
      required_quantity: line.required_quantity.toString(),
    })) ?? [],
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = mode === 'create' ? 'Registrar nuevo complemento' : 'Editar complemento'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const supplies: ComplementSupplyInput[] = []

    for (const line of supplyLines) {
      const hasQuantity = line.required_quantity.trim() !== ''

      if (line.supply_id === '' && !hasQuantity) {
        continue
      }

      if (line.supply_id === '' || !hasQuantity) {
        setError('Cada insumo asociado debe tener seleccionado un insumo y una cantidad.')
        return
      }

      const quantity = Number(line.required_quantity)

      if (Number.isNaN(quantity) || quantity <= 0) {
        setError('La cantidad de cada insumo debe ser un número mayor a 0.')
        return
      }

      supplies.push({ supply_id: line.supply_id, required_quantity: quantity })
    }

    const payload: CreateComplementPayload | UpdateComplementPayload = {
      name,
      description: description || undefined,
      extra_price: Number(extraPrice),
      supplies,
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el complemento.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          id="name"
          label="Nombre"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <TextareaField
          id="description"
          label="Descripción (opcional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
        <FormField
          id="extra_price"
          label="Precio extra"
          type="number"
          step="0.01"
          min="0"
          value={extraPrice}
          onChange={(event) => setExtraPrice(event.target.value)}
          required
        />
        <SupplyQuantityPicker
          availableSupplies={availableSupplies}
          lines={supplyLines}
          onChange={setSupplyLines}
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
