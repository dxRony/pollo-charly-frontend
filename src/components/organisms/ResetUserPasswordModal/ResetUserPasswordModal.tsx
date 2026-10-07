import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Modal } from '@/components/molecules/Modal'
import type { User } from '@/types/auth'
import styles from './ResetUserPasswordModal.module.css'

interface ResetUserPasswordModalProps {
  user: User
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function ResetUserPasswordModal({ user, onClose, onConfirm }: ResetUserPasswordModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleConfirm() {
    setError(null)
    setIsSubmitting(true)

    try {
      await onConfirm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title="Restablecer contraseña" onClose={onClose}>
      <div className={styles.content}>
        <p className={styles.warning}>
          Se generará una contraseña temporal nueva para <strong>{user.name}</strong> y se enviará a{' '}
          <strong>{user.email}</strong>. Su contraseña actual dejará de funcionar, se cerrarán sus
          sesiones abiertas y deberá cambiarla al iniciar sesión.
        </p>
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Restablecer y enviar'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
