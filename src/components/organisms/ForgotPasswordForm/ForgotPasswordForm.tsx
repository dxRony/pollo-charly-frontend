import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import styles from './ForgotPasswordForm.module.css'

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<string>
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const message = await onSubmit(email)
      setSuccessMessage(message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la solicitud.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successMessage) {
    return (
      <div className={styles.card}>
        <div className={styles.titleBar}>
          <h2 className={styles.title}>Revisa tu correo</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.formInfo}>{successMessage}</p>
          <Link className={styles.backLink} to="/login">
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.titleBar}>
        <h2 className={styles.title}>Recuperar contraseña</h2>
      </div>
      <form className={styles.body} onSubmit={handleSubmit}>
        <p className={styles.hint}>
          Ingresa el correo con el que te registraste y te enviaremos un enlace para restablecer tu
          contraseña.
        </p>
        <FormField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        {error && <p className={styles.formError}>{error}</p>}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>
        <p className={styles.actions}>
          <Link className={styles.backLink} to="/login">
            Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  )
}
