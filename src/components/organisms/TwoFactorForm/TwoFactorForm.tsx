import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import styles from './TwoFactorForm.module.css'

interface TwoFactorFormProps {
  email: string
  onSubmit: (code: string) => Promise<void>
  onResend: () => Promise<string>
  onBack: () => void
}

const RESEND_COOLDOWN_SECONDS = 60

export function TwoFactorForm({ email, onSubmit, onResend, onBack }: TwoFactorFormProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }

    const timer = setInterval(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit(code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo verificar el código.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    setError(null)
    setInfoMessage(null)
    setIsResending(true)

    try {
      const message = await onResend()
      setInfoMessage(message)
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo reenviar el código.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.titleBar}>
        <h2 className={styles.title}>Verificación de dos factores</h2>
      </div>
      <form className={styles.body} onSubmit={handleSubmit}>
        <p className={styles.hint}>
          Enviamos un código de 6 dígitos a <strong>{email}</strong>. Ingrésalo antes de que expire (5
          minutos).
        </p>
        <FormField
          id="code"
          label="Código de verificación"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
          required
        />
        {error && <p className={styles.formError}>{error}</p>}
        {infoMessage && !error && <p className={styles.formInfo}>{infoMessage}</p>}
        <Button type="submit" variant="primary" disabled={isSubmitting || code.length !== 6}>
          {isSubmitting ? 'Verificando...' : 'Verificar código'}
        </Button>
        <p className={styles.actions}>
          <button
            type="button"
            className={styles.linkButton}
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
          >
            {cooldown > 0 ? `Reenviar código (${cooldown}s)` : 'Reenviar código'}
          </button>
          <button type="button" className={styles.linkButton} onClick={onBack}>
            Volver
          </button>
        </p>
      </form>
    </div>
  )
}
