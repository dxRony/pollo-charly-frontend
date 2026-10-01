import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { UsersFilterBar } from '@/components/organisms/UsersFilterBar'
import { UsersTable } from '@/components/organisms/UsersTable'
import { UserFormModal } from '@/components/organisms/UserFormModal'
import { useUsers } from '@/hooks/useUsers'
import { useRoles } from '@/hooks/useRoles'
import { useAuth } from '@/hooks/useAuth'
import * as userService from '@/services/userService'
import type { User } from '@/types/auth'
import type { CreateUserPayload, UpdateUserPayload } from '@/types/user'
import styles from './UsersPage.module.css'

type ModalState = { mode: 'create' } | { mode: 'edit'; user: User } | null

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const { users, pagination, filters, isLoading, error, updateFilters, setPage, refetch } = useUsers()
  const { roles } = useRoles()
  const [modalState, setModalState] = useState<ModalState>(null)

  if (!currentUser) {
    return null
  }

  const otherUsers = users.filter((targetUser) => targetUser.id !== currentUser.id)

  async function handleFormSubmit(payload: CreateUserPayload | UpdateUserPayload) {
    if (modalState?.mode === 'edit') {
      await userService.updateUser(modalState.user.id, payload as UpdateUserPayload)
    } else {
      await userService.createUser(payload as CreateUserPayload)
    }
    setModalState(null)
    await refetch()
  }

  async function handleToggleStatus(targetUser: User) {
    await userService.toggleUserStatus(targetUser.id, !targetUser.is_active)
    await refetch()
  }

  return (
    <div>
      <h1 className={styles.title}>Gestión de usuarios</h1>

      <UsersFilterBar
        search={filters.search ?? ''}
        roleId={filters.role_id ?? ''}
        isActive={filters.is_active === undefined ? '' : String(filters.is_active)}
        roles={roles}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onRoleChange={(value) => updateFilters({ role_id: value === '' ? undefined : value })}
        onStatusChange={(value) =>
          updateFilters({ is_active: value === '' ? undefined : value === 'true' })
        }
        onCreateClick={() => setModalState({ mode: 'create' })}
      />

      {error && <p className={styles.error}>{error}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando usuarios...</p>
      ) : (
        <UsersTable
          users={otherUsers}
          onEdit={(targetUser) => setModalState({ mode: 'edit', user: targetUser })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {pagination && pagination.lastPage > 1 && (
        <div className={styles.pagination}>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage <= 1}
            onClick={() => setPage(pagination.currentPage - 1)}
          >
            Anterior
          </Button>
          <span className={styles.pageInfo}>
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => setPage(pagination.currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {modalState && (
        <UserFormModal
          mode={modalState.mode}
          roles={roles}
          initialUser={modalState.mode === 'edit' ? modalState.user : undefined}
          onClose={() => setModalState(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
