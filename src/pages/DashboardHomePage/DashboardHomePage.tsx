import { lazy, Suspense } from 'react'
import { LoadingMessage } from '@/components/atoms/LoadingMessage'
import { useAuth } from '@/hooks/useAuth'
import { WaiterCashierDashboard } from './components/WaiterCashierDashboard/WaiterCashierDashboard'
import { CookDashboard } from './components/CookDashboard/CookDashboard'
import { DashboardHero } from './components/DashboardHero/DashboardHero'

// El panel del administrador incluye las gráficas (Recharts): se carga bajo demanda solo para ese rol.
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard/AdminDashboard').then((module) => ({ default: module.AdminDashboard })),
)

export function DashboardHomePage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const roleName = user.role?.name ?? 'Usuario'

  if (roleName === 'Administrador') {
    return (
      <Suspense fallback={<LoadingMessage message="Cargando métricas del sistema..." />}>
        <AdminDashboard />
      </Suspense>
    )
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
