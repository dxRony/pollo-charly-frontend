import { Outlet, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import type { DashboardTab } from '@/components/organisms/DashboardNavBar'
import { useAuth } from '@/hooks/useAuth'

const ADMIN_TABS: DashboardTab[] = [
  { label: 'Usuarios', icon: '👥', to: '/dashboard/users' },
  { label: 'Platillos', icon: '🍗', to: '/dashboard/dishes' },
  { label: 'Menú del día', icon: '📅', to: '/dashboard/daily-menu' },
  { label: 'Complementos', icon: '🥗', to: '/dashboard/complements' },
  { label: 'Insumos', icon: '📦', to: '/dashboard/supplies' },
  { label: 'Movimientos', icon: '🔄', to: '/dashboard/inventory-movements' },
  { label: 'Alertas', icon: '⚠️', to: '/dashboard/supply-alerts' },
  { label: 'Reportes', icon: '📊' },
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

export function DashboardShell() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const roleName = user.role?.name ?? 'Usuario'
  const tabs = TABS_BY_ROLE[roleName] ?? PLACEHOLDER_TABS

  return (
    <DashboardLayout tabs={tabs} onProfile={() => navigate('/dashboard/profile')} onLogout={handleLogout}>
      <Outlet />
    </DashboardLayout>
  )
}
