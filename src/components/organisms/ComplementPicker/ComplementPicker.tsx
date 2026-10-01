import { FieldLabel } from '@/components/atoms/FieldLabel'
import type { Complement } from '@/types/complement'
import styles from './ComplementPicker.module.css'

interface ComplementPickerProps {
  availableComplements: Complement[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export function ComplementPicker({ availableComplements, selectedIds, onChange }: ComplementPickerProps) {
  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className={styles.picker}>
      <FieldLabel>Complementos aplicables</FieldLabel>
      {availableComplements.length === 0 ? (
        <p className={styles.empty}>No hay complementos disponibles.</p>
      ) : (
        <div className={styles.list}>
          {availableComplements.map((complement) => (
            <label key={complement.id} className={styles.item}>
              <input
                type="checkbox"
                checked={selectedIds.includes(complement.id)}
                onChange={() => toggle(complement.id)}
              />
              {complement.name} (+{complement.extra_price.toFixed(2)})
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
