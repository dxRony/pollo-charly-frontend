import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { useAuth } from '@/hooks/useAuth'
import styles from './TwoFactorSettings.module.css'

export function TwoFactorSettings() {
  const { user, enableTwoFactor, disableTwoFactor } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return null
  }

  const isTwoFactorEnabled = user.two_factor_enabled

  async function handleToggle() {
    setError(null)
    setIsSubmitting(true)

    try {
      if (isTwoFactorEnabled) {
        await disableTwoFactor()
      } else {
        await enableTwoFactor()
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo actualizar la verificación en dos pasos.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Verificación en dos pasos</h2>
      <p className={styles.status}>
        Estado actual:{' '}
        <strong className={user.two_factor_enabled ? styles.enabled : styles.disabled}>
          {user.two_factor_enabled ? 'Activada' : 'Desactivada'}
        </strong>
      </p>
      <p className={styles.description}>
        {user.two_factor_enabled
          ? 'Cada vez que inicies sesión, te pediremos un código de verificación enviado a tu correo.'
          : 'Actívala para proteger tu cuenta con un código de verificación enviado a tu correo cada vez que inicies sesión.'}
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <Button
        type="button"
        variant={user.two_factor_enabled ? 'accent' : 'primary'}
        onClick={handleToggle}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Guardando...'
          : user.two_factor_enabled
            ? 'Desactivar verificación en dos pasos'
            : 'Activar verificación en dos pasos'}
      </Button>
    </div>
  )
}
