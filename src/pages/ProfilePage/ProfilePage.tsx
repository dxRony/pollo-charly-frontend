import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { ChangePasswordForm } from '@/components/organisms/ChangePasswordForm'
import { TwoFactorSettings } from '@/components/organisms/TwoFactorSettings'
import { useAuth } from '@/hooks/useAuth'
import { ApiError } from '@/services/api'
import * as authService from '@/services/authService'
import type { ChangePasswordPayload } from '@/types/auth'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { user, refreshUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!user) {
    return null
  }

  function handleStartEdit() {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setError(null)
    setIsEditing(true)
  }

  function handleCancelEdit() {
    setIsEditing(false)
    setError(null)
  }

  async function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      setError('El nombre es obligatorio.')
      return
    }

    if (!trimmedEmail) {
      setError('El correo electrónico es obligatorio.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authService.updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      })
      await refreshUser()
      setSuccessMessage(response.message || 'Perfil actualizado exitosamente.')
      setIsEditing(false)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setError(Object.values(err.errors).flat().join(' '))
      } else {
        setError(err instanceof Error ? err.message : 'No se pudo actualizar el perfil.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleChangePassword(payload: ChangePasswordPayload): Promise<string> {
    const response = await authService.changePassword(payload)
    return response.message
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Mi perfil</h1>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Información de la cuenta</h2>
        </div>

        {successMessage && <div className={styles.successBanner}>{successMessage}</div>}

        {!isEditing ? (
          <>
            <dl className={styles.infoList}>
              <dt>Nombre</dt>
              <dd>{user.name}</dd>
              <dt>Correo electrónico</dt>
              <dd>{user.email}</dd>
              <dt>Rol</dt>
              <dd>
                <Badge tone="accent">{user.role?.name ?? 'Usuario'}</Badge>
              </dd>
            </dl>
            <div className={styles.cardFooter}>
              <Button size="sm" variant="primary" onClick={handleStartEdit}>
                Editar perfil
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleProfileSubmit} className={styles.editForm}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <FormField
              id="profile_name"
              label="Nombre completo"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              required
              autoFocus
            />

            <FormField
              id="profile_email"
              label="Correo electrónico"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />

            <div className={styles.roleGroup}>
              <span className={styles.roleLabel}>Rol de usuario</span>
              <div>
                <Badge tone="accent">{user.role?.name ?? 'Usuario'}</Badge>
              </div>
              <p className={styles.roleNotice}>El rol es administrado por la gerencia.</p>
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                size="sm"
                variant="accent"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        )}
      </div>

      <TwoFactorSettings />

      <div className={styles.fullWidth}>
        <ChangePasswordForm onSubmit={handleChangePassword} />
      </div>
    </div>
  )
}
