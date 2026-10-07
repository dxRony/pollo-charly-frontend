import { Navigate } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { SplitSection } from '@/components/molecules/SplitSection'
import { ChangePasswordForm } from '@/components/organisms/ChangePasswordForm'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { useAuth } from '@/hooks/useAuth'
import * as authService from '@/services/authService'
import type { ChangePasswordPayload } from '@/types/auth'

export function ForcePasswordChangePage() {
  const { user, isLoading, logout, refreshUser } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.must_change_password) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(payload: ChangePasswordPayload): Promise<string> {
    const response = await authService.changePassword(payload)
    await refreshUser()
    return response.message
  }

  return (
    <PublicLayout actionLabel="Cerrar sesión" onAction={logout}>
      <SplitSection
        leftBackground="accent"
        left={<Logo size="lg" />}
        right={
          <ChangePasswordForm
            description="Iniciaste sesión con una contraseña temporal. Para continuar, elige una contraseña nueva que solo tú conozcas."
            onSubmit={handleSubmit}
          />
        }
      />
    </PublicLayout>
  )
}
