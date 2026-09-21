import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import { OrderItemsEditor, type OrderItemFormLine } from '@/components/organisms/OrderItemsEditor'
import { formatOrderError } from '@/utils/formatOrderError'
import type {
  CreateOrderItemComplementPayload,
  CreateOrderItemPayload,
  ModifyOrderPayload,
  Order,
} from '@/types/order'
import type { Dish } from '@/types/dish'
import styles from './ModifyOrderModal.module.css'

interface ModifyOrderModalProps {
  order: Order
  availableDishes: Dish[]
  onClose: () => void
  onSubmit: (payload: ModifyOrderPayload) => Promise<void>
}

function itemStatusLabel(statusName: string): string | null {
  if (statusName === 'eliminado') {
    return 'Eliminado'
  }
  if (statusName === 'cancelado') {
    return 'Cancelado'
  }
  return null
}

export function ModifyOrderModal({ order, availableDishes, onClose, onSubmit }: ModifyOrderModalProps) {
  const [notes, setNotes] = useState(order.notes ?? '')
  const [removeItemIds, setRemoveItemIds] = useState<number[]>([])
  const [newItems, setNewItems] = useState<OrderItemFormLine[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleRemove(itemId: number) {
    setRemoveItemIds((previous) =>
      previous.includes(itemId) ? previous.filter((id) => id !== itemId) : [...previous, itemId],
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const addItems: CreateOrderItemPayload[] = []

    for (const item of newItems) {
      if (item.dish_id === '') {
        continue
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity <= 0) {
        setError('La cantidad de cada platillo nuevo debe ser un número entero mayor a 0.')
        return
      }

      const complements: CreateOrderItemComplementPayload[] = []

      for (const complementLine of item.complements) {
        const complementQuantity = Number(complementLine.quantity)

        if (!Number.isInteger(complementQuantity) || complementQuantity <= 0) {
          setError('La cantidad de cada complemento debe ser un número entero mayor a 0.')
          return
        }

        complements.push({
          complement_id: complementLine.complement_id,
          quantity: complementQuantity,
        })
      }

      addItems.push({
        dish_id: item.dish_id,
        quantity,
        notes: item.notes.trim() || undefined,
        complements: complements.length > 0 ? complements : undefined,
      })
    }

    const payload: ModifyOrderPayload = {}

    if (notes.trim()) {
      payload.notes = notes.trim()
    }
    if (removeItemIds.length > 0) {
      payload.remove_item_ids = removeItemIds
    }
    if (addItems.length > 0) {
      payload.add_items = addItems
    }

    if (!payload.notes && !payload.remove_item_ids && !payload.add_items) {
      setError(
        'Debes indicar al menos un cambio: eliminar un platillo, agregar uno nuevo o actualizar las observaciones.',
      )
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(formatOrderError(err, 'No se pudo modificar la comanda.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={`Modificar comanda ${order.code}`} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {order.is_modification_restricted && (
          <p className={styles.restriction}>
            {order.modification_restriction_reason ??
              'Esta comanda tiene restricciones de modificación.'}
          </p>
        )}

        <FieldLabel>Platillos actuales</FieldLabel>
        <div className={styles.currentItems}>
          {order.items.map((item) => {
            const statusLabel = itemStatusLabel(item.status_name)
            const isRemovable = statusLabel === null

            return (
              <label
                key={item.id}
                className={isRemovable ? styles.currentItemRow : styles.currentItemRowDisabled}
              >
                {isRemovable ? (
                  <input
                    type="checkbox"
                    checked={removeItemIds.includes(item.id)}
                    disabled={order.is_modification_restricted}
                    onChange={() => toggleRemove(item.id)}
                    title={
                      order.is_modification_restricted
                        ? (order.modification_restriction_reason ?? undefined)
                        : undefined
                    }
                  />
                ) : (
                  <input type="checkbox" checked={false} disabled />
                )}
                <span>
                  {item.quantity}x {item.dish?.name ?? '—'}
                  {statusLabel && ` (${statusLabel})`}
                </span>
              </label>
            )
          })}
        </div>

        <TextareaField
          id="notes"
          label="Observaciones (opcional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
        />

        <OrderItemsEditor availableDishes={availableDishes} items={newItems} onChange={setNewItems} />

        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cerrar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
