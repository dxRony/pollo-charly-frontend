import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { SelectField } from '@/components/molecules/SelectField'
import { Modal } from '@/components/molecules/Modal'
import type { CreateSupplyPayload, MeasurementUnit, Supply, UpdateSupplyPayload } from '@/types/supply'
import styles from './SupplyFormModal.module.css'

interface SupplyFormModalProps {
  mode: 'create' | 'edit'
  measurementUnits: MeasurementUnit[]
  initialSupply?: Supply
  onClose: () => void
  onSubmit: (payload: CreateSupplyPayload | UpdateSupplyPayload) => Promise<void>
}

export function SupplyFormModal({
  mode,
  measurementUnits,
  initialSupply,
  onClose,
  onSubmit,
}: SupplyFormModalProps) {
  const [name, setName] = useState(initialSupply?.name ?? '')
  const [code, setCode] = useState(initialSupply?.code ?? '')
  const [measurementUnitId, setMeasurementUnitId] = useState<number | ''>(
    initialSupply?.measurement_unit_id ?? '',
  )
  const [minimumStock, setMinimumStock] = useState(initialSupply?.minimum_stock.toString() ?? '')
  const [unitCost, setUnitCost] = useState(initialSupply?.unit_cost.toString() ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = mode === 'create' ? 'Registrar nuevo insumo' : 'Editar insumo'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (measurementUnitId === '') {
      setError('Debes seleccionar una unidad de medida.')
      return
    }

    const payload: CreateSupplyPayload | UpdateSupplyPayload = {
      name,
      code: code || undefined,
      measurement_unit_id: measurementUnitId,
      minimum_stock: Number(minimumStock),
      unit_cost: Number(unitCost),
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el insumo.')
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
        <FormField
          id="code"
          label="Código"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Dejar en blanco para generarlo automáticamente"
        />
        <SelectField
          id="measurement_unit_id"
          label="Unidad de medida"
          value={measurementUnitId}
          onChange={(event) =>
            setMeasurementUnitId(event.target.value === '' ? '' : Number(event.target.value))
          }
          required
        >
          <option value="">Selecciona una unidad</option>
          {measurementUnits.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name} ({unit.abbreviation})
            </option>
          ))}
        </SelectField>
        <FormField
          id="minimum_stock"
          label="Stock mínimo"
          type="number"
          step="0.01"
          min="0.01"
          value={minimumStock}
          onChange={(event) => setMinimumStock(event.target.value)}
          required
        />
        <FormField
          id="unit_cost"
          label="Costo unitario"
          type="number"
          step="0.01"
          min="0"
          value={unitCost}
          onChange={(event) => setUnitCost(event.target.value)}
          required
        />
        {mode === 'edit' && initialSupply && (
          <p className={styles.stockHint}>
            Stock actual: {initialSupply.current_stock.toFixed(2)} — solo se actualiza mediante
            movimientos de inventario.
          </p>
        )}
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
