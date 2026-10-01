import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { TwoFactorSettings } from '@/components/organisms/TwoFactorSettings'
import { useAuth } from '@/hooks/useAuth'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
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
        <Button type="button" onClick={() => navigate('/forgot-password')}>
          Cambiar contraseña
        </Button>
      </div>

      <TwoFactorSettings />
    </div>
  )
}
