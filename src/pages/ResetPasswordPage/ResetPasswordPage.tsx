import { useNavigate, useSearchParams } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { SplitSection } from '@/components/molecules/SplitSection'
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm'
import { PublicLayout } from '@/components/templates/PublicLayout'
import * as authService from '@/services/authService'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  async function handleSubmit(password: string, passwordConfirmation: string): Promise<string> {
    const response = await authService.resetPassword({
      token: token ?? '',
      email: email ?? '',
      password,
      password_confirmation: passwordConfirmation,
    })
    return response.message
  }

  return (
    <PublicLayout actionLabel="Regresar" onAction={() => navigate('/login')}>
      <SplitSection
        leftBackground="accent"
        left={<Logo size="lg" />}
        right={<ResetPasswordForm token={token} email={email} onSubmit={handleSubmit} />}
      />
    </PublicLayout>
  )
}
