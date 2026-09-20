import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import styles from './LoginForm.module.css'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.titleBar}>
        <h2 className={styles.title}>Ingresa tus credenciales</h2>
      </div>
      <form className={styles.body} onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && <p className={styles.formError}>{error}</p>}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Iniciar sesion'}
        </Button>
        <p className={styles.forgot}>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </p>
      </form>
    </div>
  )
}
