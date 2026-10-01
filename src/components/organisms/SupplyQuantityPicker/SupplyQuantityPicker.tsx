import { Button } from '@/components/atoms/Button'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import { Select } from '@/components/atoms/Select'
import { TextInput } from '@/components/atoms/TextInput'
import type { Supply } from '@/types/supply'
import styles from './SupplyQuantityPicker.module.css'

export interface SupplyQuantityLine {
  supply_id: number | ''
  required_quantity: string
}

interface SupplyQuantityPickerProps {
  availableSupplies: Supply[]
  lines: SupplyQuantityLine[]
  onChange: (lines: SupplyQuantityLine[]) => void
}

export function SupplyQuantityPicker({ availableSupplies, lines, onChange }: SupplyQuantityPickerProps) {
  function updateLine(index: number, partial: Partial<SupplyQuantityLine>) {
    onChange(lines.map((line, i) => (i === index ? { ...line, ...partial } : line)))
  }

  function removeLine(index: number) {
    onChange(lines.filter((_, i) => i !== index))
  }

  function addLine() {
    onChange([...lines, { supply_id: '', required_quantity: '' }])
  }

  const usedSupplyIds = new Set(
    lines.map((line) => line.supply_id).filter((id): id is number => id !== ''),
  )
  const canAddMore = usedSupplyIds.size < availableSupplies.length

  return (
    <div className={styles.picker}>
      <FieldLabel>Insumos asociados</FieldLabel>
      {lines.length === 0 && <p className={styles.empty}>No hay insumos asociados.</p>}
      {lines.map((line, index) => {
        const optionsForRow = availableSupplies.filter(
          (supply) => supply.id === line.supply_id || !usedSupplyIds.has(supply.id),
        )

        return (
          <div key={index} className={styles.row}>
            <Select
              value={line.supply_id}
              onChange={(event) =>
                updateLine(index, {
                  supply_id: event.target.value === '' ? '' : Number(event.target.value),
                })
              }
              className={styles.supplySelect}
            >
              <option value="">Selecciona un insumo</option>
              {optionsForRow.map((supply) => (
                <option key={supply.id} value={supply.id}>
                  {supply.name} ({supply.measurement_unit?.abbreviation ?? '—'})
                </option>
              ))}
            </Select>
            <TextInput
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Cantidad"
              value={line.required_quantity}
              onChange={(event) => updateLine(index, { required_quantity: event.target.value })}
              className={styles.quantityInput}
            />
            <Button type="button" size="sm" onClick={() => removeLine(index)}>
              Quitar
            </Button>
          </div>
        )
      })}
      <Button
        type="button"
        size="sm"
        onClick={addLine}
        disabled={!canAddMore}
        title={canAddMore ? undefined : 'Ya agregaste todos los insumos disponibles.'}
      >
        + Agregar insumo
      </Button>
    </div>
  )
}
