import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import styles from './ComplementsFilterBar.module.css'

interface ComplementsFilterBarProps {
  search: string
  isActive: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCreateClick: () => void
}

export function ComplementsFilterBar({
  search,
  isActive,
  onSearchChange,
  onStatusChange,
  onCreateClick,
}: ComplementsFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={isActive}
        onChange={(event) => onStatusChange(event.target.value)}
        className={styles.filterSelect}
      >
        <option value="">Todos los estados</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </Select>
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nuevo complemento
      </Button>
    </div>
  )
}
