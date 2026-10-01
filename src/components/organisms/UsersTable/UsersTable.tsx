import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import type { User } from '@/types/auth'
import styles from './UsersTable.module.css'

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onToggleStatus: (user: User) => void
}

export function UsersTable({ users, onEdit, onToggleStatus }: UsersTableProps) {
  if (users.length === 0) {
    return <p className={styles.empty}>No se encontraron usuarios con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role?.name ?? '—'}</td>
              <td>
                <Badge tone={user.is_active ? 'success' : 'neutral'}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className={styles.actions}>
                <Button type="button" size="sm" onClick={() => onEdit(user)}>
                  Editar
                </Button>
                <Button type="button" size="sm" variant="primary" onClick={() => onToggleStatus(user)}>
                  {user.is_active ? 'Desactivar' : 'Activar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
