import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { SelectField } from '@/components/molecules/SelectField'
import { Modal } from '@/components/molecules/Modal'
import type { Role, User } from '@/types/auth'
import type { CreateUserPayload, UpdateUserPayload } from '@/types/user'
import styles from './UserFormModal.module.css'

interface UserFormModalProps {
  mode: 'create' | 'edit'
  roles: Role[]
  initialUser?: User
  onClose: () => void
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => Promise<void>
}

export function UserFormModal({ mode, roles, initialUser, onClose, onSubmit }: UserFormModalProps) {
  const [name, setName] = useState(initialUser?.name ?? '')
  const [email, setEmail] = useState(initialUser?.email ?? '')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState<number | ''>(initialUser?.role?.id ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = mode === 'create' ? 'Registrar nuevo usuario' : `Editar usuario`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (roleId === '') {
      setError('Debes seleccionar un rol.')
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'create') {
        const payload: CreateUserPayload = { name, email, password, role_id: roleId }
        await onSubmit(payload)
      } else {
        const payload: UpdateUserPayload = { name, email, role_id: roleId }
        if (password) {
          payload.password = password
        }
        await onSubmit(payload)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el usuario.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          id="name"
          label="Nombre completo"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <FormField
          id="password"
          label={mode === 'create' ? 'Contraseña inicial' : 'Nueva contraseña (opcional)'}
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={mode === 'edit' ? 'Dejar en blanco para no cambiarla' : undefined}
          required={mode === 'create'}
        />
        <SelectField
          id="role_id"
          label="Rol"
          value={roleId}
          onChange={(event) => setRoleId(event.target.value === '' ? '' : Number(event.target.value))}
          required
        >
          <option value="">Selecciona un rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </SelectField>
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
