import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { PasswordField } from '@/components/molecules/PasswordField'
import type { ChangePasswordPayload } from '@/types/auth'
import styles from './ChangePasswordForm.module.css'

interface ChangePasswordFormProps {
  description?: string
  onSubmit: (payload: ChangePasswordPayload) => Promise<string>
}

export function ChangePasswordForm({
  description = 'Por seguridad, al cambiarla se cerrarán tus sesiones abiertas en otros dispositivos.',
  onSubmit,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (password !== passwordConfirmation) {
      setError('La confirmación de la contraseña no coincide.')
      return
    }

    setIsSubmitting(true)

    try {
      const message = await onSubmit({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      })
      setSuccessMessage(message)
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Cambiar contraseña</h2>
      <p className={styles.description}>{description}</p>
      <form onSubmit={handleSubmit}>
        <PasswordField
          id="current_password"
          label="Contraseña actual"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
        <PasswordField
          id="new_password"
          label="Nueva contraseña"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <PasswordField
          id="new_password_confirmation"
          label="Confirmar nueva contraseña"
          autoComplete="new-password"
          minLength={8}
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          required
        />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {successMessage && (
          <p className={styles.success} role="status">
            {successMessage}
          </p>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
        </Button>
      </form>
    </div>
  )
}
