import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import type { DashboardTab } from '@/components/organisms/DashboardNavBar'
import { useAuth } from '@/hooks/useAuth'
import styles from './DashboardPage.module.css'

const ADMIN_TABS: DashboardTab[] = [
  { label: 'Usuarios' },
  { label: 'Platillos' },
  { label: 'Insumos' },
  { label: 'Proveedores' },
  { label: 'Reportes', icon: '📖' },
]

const PLACEHOLDER_TABS: DashboardTab[] = [
  { label: 'Tab1', hasSubmenu: false },
  { label: 'Tab2', hasSubmenu: false },
  { label: 'Tab3', hasSubmenu: false },
]

const TABS_BY_ROLE: Record<string, DashboardTab[]> = {
  Administrador: ADMIN_TABS,
  'Mesero/Cajero': PLACEHOLDER_TABS,
  Cocinero: PLACEHOLDER_TABS,
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const tabs = TABS_BY_ROLE[user.role.name] ?? PLACEHOLDER_TABS

  return (
    <DashboardLayout tabs={tabs} onLogout={handleLogout}>
      <h1 className={styles.welcome}>
        Bienvenido {user.role.name} {user.name}
      </h1>
    </DashboardLayout>
  )
}
