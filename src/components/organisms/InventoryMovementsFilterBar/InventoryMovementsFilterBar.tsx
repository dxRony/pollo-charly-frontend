import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import { MOVEMENT_TYPE_OPTIONS } from '@/types/inventoryMovement'
import type { InventoryMovementTypeAlias } from '@/types/inventoryMovement'
import type { Supply } from '@/types/supply'
import styles from './InventoryMovementsFilterBar.module.css'

interface InventoryMovementsFilterBarProps {
  search: string
  supplyId: number | ''
  type: InventoryMovementTypeAlias | ''
  pendingAdjustmentsOnly: boolean
  supplies: Supply[]
  onSearchChange: (value: string) => void
  onSupplyChange: (value: number | '') => void
  onTypeChange: (value: InventoryMovementTypeAlias | '') => void
  onPendingAdjustmentsChange: (value: boolean) => void
  onCreateClick: () => void
}

export function InventoryMovementsFilterBar({
  search,
  supplyId,
  type,
  pendingAdjustmentsOnly,
  supplies,
  onSearchChange,
  onSupplyChange,
  onTypeChange,
  onPendingAdjustmentsChange,
  onCreateClick,
}: InventoryMovementsFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por motivo o insumo..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={supplyId}
        onChange={(event) => onSupplyChange(event.target.value === '' ? '' : Number(event.target.value))}
        className={styles.filterSelect}
      >
        <option value="">Todos los insumos</option>
        {supplies.map((supply) => (
          <option key={supply.id} value={supply.id}>
            {supply.name}
          </option>
        ))}
      </Select>
      <Select
        value={type}
        onChange={(event) => onTypeChange(event.target.value as InventoryMovementTypeAlias | '')}
        className={styles.filterSelect}
      >
        <option value="">Todos los tipos</option>
        {MOVEMENT_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <label className={styles.pendingToggle}>
        <input
          type="checkbox"
          checked={pendingAdjustmentsOnly}
          onChange={(event) => onPendingAdjustmentsChange(event.target.checked)}
        />
        Solo ajustes pendientes
      </label>
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nuevo movimiento
      </Button>
    </div>
  )
}
