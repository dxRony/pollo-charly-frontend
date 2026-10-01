import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import type { TableStatusName } from '@/types/restaurantTable'
import styles from './RestaurantTablesFilterBar.module.css'

interface RestaurantTablesFilterBarProps {
  search: string
  status: TableStatusName | ''
  onSearchChange: (value: string) => void
  onStatusChange: (value: TableStatusName | '') => void
  onCreateClick: () => void
}

export function RestaurantTablesFilterBar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onCreateClick,
}: RestaurantTablesFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por número de mesa..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as TableStatusName | '')}
        className={styles.filterSelect}
      >
        <option value="">Todos los estados</option>
        <option value="disponible">Disponible</option>
        <option value="ocupada">Ocupada</option>
        <option value="mantenimiento">Mantenimiento</option>
        <option value="inactiva">Inactiva</option>
      </Select>
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nueva mesa
      </Button>
    </div>
  )
}
