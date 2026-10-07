import { ChangePasswordForm } from '@/components/organisms/ChangePasswordForm'
import { TwoFactorSettings } from '@/components/organisms/TwoFactorSettings'
import { useAuth } from '@/hooks/useAuth'
import * as authService from '@/services/authService'
import type { ChangePasswordPayload } from '@/types/auth'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  async function handleChangePassword(payload: ChangePasswordPayload): Promise<string> {
    const response = await authService.changePassword(payload)
    return response.message
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Mi perfil</h1>
      
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Información de la cuenta</h2>
        <dl className={styles.infoList}>
          <dt>Nombre</dt>
          <dd>{user.name}</dd>
          <dt>Correo electrónico</dt>
          <dd>{user.email}</dd>
          <dt>Rol</dt>
          <dd>{user.role?.name ?? 'Usuario'}</dd>
        </dl>
      </div>

      <TwoFactorSettings />

      <div className={styles.fullWidth}>
        <ChangePasswordForm onSubmit={handleChangePassword} />
      </div>
    </div>
  )
}
