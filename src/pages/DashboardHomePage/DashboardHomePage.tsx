import { useAuth } from '@/hooks/useAuth'
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard'
import { WaiterCashierDashboard } from './components/WaiterCashierDashboard/WaiterCashierDashboard'
import { CookDashboard } from './components/CookDashboard/CookDashboard'
import { DashboardHero } from './components/DashboardHero/DashboardHero'

export function DashboardHomePage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const roleName = user.role?.name ?? 'Usuario'

  if (roleName === 'Administrador') {
    return <AdminDashboard />
  }

  if (roleName === 'Mesero/Cajero') {
    return <WaiterCashierDashboard />
  }

  if (roleName === 'Cocinero') {
    return <CookDashboard />
  }

  return (
    <DashboardHero
      userName={user.name}
      roleName={roleName}
      subtitle="Bienvenido al panel general de Pollo Charly."
    />
  )
}
