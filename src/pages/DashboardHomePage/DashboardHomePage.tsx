import { useAuth } from '@/hooks/useAuth'
import styles from './DashboardHomePage.module.css'

export function DashboardHomePage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const roleName = user.role?.name ?? 'Usuario'

  return (
    <h1 className={styles.welcome}>
      Bienvenido {roleName} {user.name}
    </h1>
  )
}
