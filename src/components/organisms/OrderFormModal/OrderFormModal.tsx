import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { SelectField } from '@/components/molecules/SelectField'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import { OrderItemsEditor, type OrderItemFormLine } from '@/components/organisms/OrderItemsEditor'
import { formatOrderError } from '@/utils/formatOrderError'
import { ORDER_TYPE_OPTIONS } from '@/types/order'
import type {
  CreateOrderItemComplementPayload,
  CreateOrderItemPayload,
  CreateOrderPayload,
  OrderTypeAlias,
} from '@/types/order'
import type { Dish } from '@/types/dish'
import type { RestaurantTable } from '@/types/restaurantTable'
import styles from './OrderFormModal.module.css'

interface OrderFormModalProps {
  availableDishes: Dish[]
  availableTables: RestaurantTable[]
  onClose: () => void
  onSubmit: (payload: CreateOrderPayload) => Promise<void>
}

export function OrderFormModal({
  availableDishes,
  availableTables,
  onClose,
  onSubmit,
}: OrderFormModalProps) {
  const [orderType, setOrderType] = useState<OrderTypeAlias>('en_mesa')
  const [tableId, setTableId] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<OrderItemFormLine[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (orderType === 'en_mesa' && tableId === '') {
      setError('Debes seleccionar una mesa libre para un pedido en mesa.')
      return
    }

    const validItems: CreateOrderItemPayload[] = []

    for (const item of items) {
      if (item.dish_id === '') {
        continue
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity <= 0) {
        setError('La cantidad de cada platillo debe ser un número entero mayor a 0.')
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

      validItems.push({
        dish_id: item.dish_id,
        quantity,
        notes: item.notes.trim() || undefined,
        complements: complements.length > 0 ? complements : undefined,
      })
    }

    if (validItems.length === 0) {
      setError('Debes agregar al menos un platillo con cantidad válida.')
      return
    }

    const payload: CreateOrderPayload = {
      order_type: orderType,
      notes: notes.trim() || undefined,
      items: validItems,
    }

    if (orderType === 'en_mesa') {
      payload.restaurant_table_id = tableId as number
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(formatOrderError(err, 'No se pudo registrar la comanda.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar nueva comanda" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <SelectField
          id="order_type"
          label="Tipo de pedido"
          value={orderType}
          onChange={(event) => {
            setOrderType(event.target.value as OrderTypeAlias)
            setTableId('')
          }}
          required
        >
          {ORDER_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        {orderType === 'en_mesa' && (
          <SelectField
            id="table"
            label="Mesa"
            value={tableId}
            onChange={(event) => setTableId(event.target.value === '' ? '' : Number(event.target.value))}
            required
          >
            <option value="">
              {availableTables.length === 0 ? 'No hay mesas libres' : 'Selecciona una mesa libre'}
            </option>
            {availableTables.map((table) => (
              <option key={table.id} value={table.id}>
                Mesa {table.number} ({table.capacity} personas)
              </option>
            ))}
          </SelectField>
        )}
        <TextareaField
          id="notes"
          label="Observaciones generales (opcional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
        />
        <OrderItemsEditor availableDishes={availableDishes} items={items} onChange={setItems} />
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Registrar comanda'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
