import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import type { MeasurementUnit } from '@/types/supply'
import styles from './SuppliesFilterBar.module.css'

interface SuppliesFilterBarProps {
  search: string
  measurementUnitId: number | ''
  isActive: string
  lowStockOnly: boolean
  measurementUnits: MeasurementUnit[]
  onSearchChange: (value: string) => void
  onMeasurementUnitChange: (value: number | '') => void
  onStatusChange: (value: string) => void
  onLowStockChange: (value: boolean) => void
  onCreateClick: () => void
}

export function SuppliesFilterBar({
  search,
  measurementUnitId,
  isActive,
  lowStockOnly,
  measurementUnits,
  onSearchChange,
  onMeasurementUnitChange,
  onStatusChange,
  onLowStockChange,
  onCreateClick,
}: SuppliesFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por nombre o código..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={measurementUnitId}
        onChange={(event) =>
          onMeasurementUnitChange(event.target.value === '' ? '' : Number(event.target.value))
        }
        className={styles.filterSelect}
      >
        <option value="">Todas las unidades</option>
        {measurementUnits.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </Select>
      <Select
        value={isActive}
        onChange={(event) => onStatusChange(event.target.value)}
        className={styles.filterSelect}
      >
        <option value="">Todos los estados</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </Select>
      <label className={styles.lowStockToggle}>
        <input
          type="checkbox"
          checked={lowStockOnly}
          onChange={(event) => onLowStockChange(event.target.checked)}
        />
        Solo bajo stock
      </label>
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nuevo insumo
      </Button>
    </div>
  )
}
