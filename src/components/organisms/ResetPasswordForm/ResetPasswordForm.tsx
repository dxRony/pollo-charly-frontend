import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import styles from './ResetPasswordForm.module.css'

interface ResetPasswordFormProps {
  token: string | null
  email: string | null
  onSubmit: (password: string, passwordConfirmation: string) => Promise<string>
}

export function ResetPasswordForm({ token, email, onSubmit }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!token || !email) {
    return (
      <div className={styles.card}>
        <div className={styles.titleBar}>
          <h2 className={styles.title}>Enlace inválido</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.formError}>
            Este enlace de recuperación no es válido. Verifica que copiaste la URL completa desde tu
            correo.
          </p>
          <Link className={styles.backLink} to="/forgot-password">
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const message = await onSubmit(password, passwordConfirmation)
      setSuccessMessage(message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successMessage) {
    return (
      <div className={styles.card}>
        <div className={styles.titleBar}>
          <h2 className={styles.title}>Contraseña actualizada</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.formInfo}>{successMessage}</p>
          <Link className={styles.backLink} to="/login">
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.titleBar}>
        <h2 className={styles.title}>Restablecer contraseña</h2>
      </div>
      <form className={styles.body} onSubmit={handleSubmit}>
        <p className={styles.hint}>
          Elige una nueva contraseña para <strong>{email}</strong>.
        </p>
        <FormField
          id="password"
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <FormField
          id="password_confirmation"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          required
        />
        {error && <p className={styles.formError}>{error}</p>}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Restablecer contraseña'}
        </Button>
        {error && (
          <p className={styles.actions}>
            <Link className={styles.backLink} to="/forgot-password">
              Solicitar un nuevo enlace
            </Link>
          </p>
        )}
      </form>
    </div>
  )
}
