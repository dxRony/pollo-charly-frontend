import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import type { Role } from '@/types/auth'
import styles from './UsersFilterBar.module.css'

interface UsersFilterBarProps {
  search: string
  roleId: number | ''
  isActive: string
  roles: Role[]
  onSearchChange: (value: string) => void
  onRoleChange: (value: number | '') => void
  onStatusChange: (value: string) => void
  onCreateClick: () => void
}

export function UsersFilterBar({
  search,
  roleId,
  isActive,
  roles,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onCreateClick,
}: UsersFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por nombre o correo..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={roleId}
        onChange={(event) => onRoleChange(event.target.value === '' ? '' : Number(event.target.value))}
        className={styles.filterSelect}
      >
        <option value="">Todos los roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
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
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nuevo usuario
      </Button>
    </div>
  )
}
