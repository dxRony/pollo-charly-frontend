import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { SplitSection } from '@/components/molecules/SplitSection'
import { ForgotPasswordForm } from '@/components/organisms/ForgotPasswordForm'
import { PublicLayout } from '@/components/templates/PublicLayout'
import * as authService from '@/services/authService'

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  async function handleSubmit(email: string): Promise<string> {
    const response = await authService.forgotPassword(email)
    return response.message
  }

  return (
    <PublicLayout actionLabel="Regresar" onAction={() => navigate('/login')}>
      <SplitSection
        leftBackground="accent"
        left={<Logo size="lg" />}
        right={<ForgotPasswordForm onSubmit={handleSubmit} />}
      />
    </PublicLayout>
  )
}
