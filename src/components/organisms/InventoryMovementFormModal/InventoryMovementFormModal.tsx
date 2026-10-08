import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { SelectField } from '@/components/molecules/SelectField'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import { useAuth } from '@/hooks/useAuth'
import { MOVEMENT_TYPE_OPTIONS } from '@/types/inventoryMovement'
import type { CreateInventoryMovementPayload, InventoryMovementTypeAlias } from '@/types/inventoryMovement'
import type { Supply } from '@/types/supply'
import styles from './InventoryMovementFormModal.module.css'

interface InventoryMovementFormModalProps {
  availableSupplies: Supply[]
  onClose: () => void
  onSubmit: (payload: CreateInventoryMovementPayload) => Promise<void>
}

export function InventoryMovementFormModal({
  availableSupplies,
  onClose,
  onSubmit,
}: InventoryMovementFormModalProps) {
  const { user } = useAuth()
  const isNonAdmin = user?.role?.name !== 'Administrador'
  const [supplyId, setSupplyId] = useState<number | ''>('')
  const [type, setType] = useState<InventoryMovementTypeAlias>(isNonAdmin ? 'ajuste' : 'compra')
  const [quantity, setQuantity] = useState('')
  const [newStock, setNewStock] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAjuste = type === 'ajuste'
  const reasonRequired = isAjuste || type === 'merma'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (supplyId === '') {
      setError('Debes seleccionar un insumo.')
      return
    }

    if (reasonRequired && !reason.trim()) {
      setError('El motivo es obligatorio para este tipo de movimiento.')
      return
    }

    const payload: CreateInventoryMovementPayload = { supply_id: supplyId, type }

    if (isAjuste) {
      if (!newStock.trim()) {
        setError('Debes ingresar la existencia corregida.')
        return
      }
      payload.new_stock = Number(newStock)
    } else {
      if (!quantity.trim()) {
        setError('Debes ingresar la cantidad.')
        return
      }
      payload.quantity = Number(quantity)
    }

    if (reason.trim()) {
      payload.reason = reason.trim()
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el movimiento.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar movimiento de inventario" onClose={onClose}>
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
        <SelectField
          id="type"
          label="Tipo de movimiento"
          value={type}
          onChange={(event) => setType(event.target.value as InventoryMovementTypeAlias)}
          required
        >
          {(isNonAdmin
            ? MOVEMENT_TYPE_OPTIONS.filter((option) => option.value === 'ajuste' || option.value === 'merma')
            : MOVEMENT_TYPE_OPTIONS
          ).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        {isAjuste ? (
          <FormField
            id="new_stock"
            label="Existencia corregida"
            type="number"
            step="0.01"
            min="0"
            value={newStock}
            onChange={(event) => setNewStock(event.target.value)}
            required
          />
        ) : (
          <FormField
            id="quantity"
            label="Cantidad"
            type="number"
            step="0.01"
            min="0.01"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        )}
        <TextareaField
          id="reason"
          label={reasonRequired ? 'Motivo' : 'Motivo (opcional)'}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          required={reasonRequired}
        />
        {isAjuste && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#1e40af',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              margin: '0.25rem 0 0.5rem',
            }}
          >
            ℹ️ Los ajustes manuales quedan pendientes y generan una alerta a la administradora con el producto, motivo, fecha y tu usuario para su aprobación.
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
