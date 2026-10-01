import { Button } from '@/components/atoms/Button'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import { Select } from '@/components/atoms/Select'
import { TextInput } from '@/components/atoms/TextInput'
import type { Dish } from '@/types/dish'
import styles from './OrderItemsEditor.module.css'

export interface OrderItemComplementFormLine {
  complement_id: number
  quantity: string
}

export interface OrderItemFormLine {
  dish_id: number | ''
  quantity: string
  notes: string
  complements: OrderItemComplementFormLine[]
}

interface OrderItemsEditorProps {
  availableDishes: Dish[]
  items: OrderItemFormLine[]
  onChange: (items: OrderItemFormLine[]) => void
}

export function OrderItemsEditor({ availableDishes, items, onChange }: OrderItemsEditorProps) {
  function updateItem(index: number, partial: Partial<OrderItemFormLine>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...partial } : item)))
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, { dish_id: '', quantity: '1', notes: '', complements: [] }])
  }

  function toggleComplement(index: number, complementId: number) {
    const item = items[index]
    const alreadySelected = item.complements.some((line) => line.complement_id === complementId)
    const complements = alreadySelected
      ? item.complements.filter((line) => line.complement_id !== complementId)
      : [...item.complements, { complement_id: complementId, quantity: '1' }]
    updateItem(index, { complements })
  }

  function updateComplementQuantity(index: number, complementId: number, quantity: string) {
    const item = items[index]
    const complements = item.complements.map((line) =>
      line.complement_id === complementId ? { ...line, quantity } : line,
    )
    updateItem(index, { complements })
  }

  return (
    <div className={styles.editor}>
      <FieldLabel>Platillos de la comanda</FieldLabel>
      {items.length === 0 && <p className={styles.empty}>Agrega al menos un platillo.</p>}
      {items.map((item, index) => {
        const dish = availableDishes.find((candidate) => candidate.id === item.dish_id)

        return (
          <div key={index} className={styles.itemCard}>
            <div className={styles.itemRow}>
              <Select
                value={item.dish_id}
                onChange={(event) =>
                  updateItem(index, {
                    dish_id: event.target.value === '' ? '' : Number(event.target.value),
                    complements: [],
                  })
                }
                className={styles.dishSelect}
              >
                <option value="">Selecciona un platillo</option>
                {availableDishes.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} ({candidate.price.toFixed(2)})
                  </option>
                ))}
              </Select>
              <TextInput
                type="number"
                step="1"
                min="1"
                placeholder="Cantidad"
                value={item.quantity}
                onChange={(event) => updateItem(index, { quantity: event.target.value })}
                className={styles.quantityInput}
              />
              <Button type="button" size="sm" onClick={() => removeItem(index)}>
                Quitar
              </Button>
            </div>
            <TextInput
              placeholder="Observaciones del platillo (opcional)"
              value={item.notes}
              onChange={(event) => updateItem(index, { notes: event.target.value })}
              className={styles.notesInput}
            />
            {dish && dish.complements.length > 0 && (
              <div className={styles.complementsList}>
                <span className={styles.complementsLabel}>Complementos:</span>
                {dish.complements.map((complement) => {
                  const selected = item.complements.find(
                    (line) => line.complement_id === complement.id,
                  )

                  return (
                    <div key={complement.id} className={styles.complementRow}>
                      <label className={styles.complementCheckbox}>
                        <input
                          type="checkbox"
                          checked={selected !== undefined}
                          onChange={() => toggleComplement(index, complement.id)}
                        />
                        {complement.name} (+{complement.extra_price.toFixed(2)})
                      </label>
                      {selected && (
                        <TextInput
                          type="number"
                          step="1"
                          min="1"
                          value={selected.quantity}
                          onChange={(event) =>
                            updateComplementQuantity(index, complement.id, event.target.value)
                          }
                          className={styles.complementQuantity}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      <Button type="button" size="sm" onClick={addItem}>
        + Agregar platillo
      </Button>
    </div>
  )
}
