import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { SplitSection } from '@/components/molecules/SplitSection'
import { LoginForm } from '@/components/organisms/LoginForm'
import { TwoFactorForm } from '@/components/organisms/TwoFactorForm'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login, verifyTwoFactor, resendTwoFactorCode } = useAuth()
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  async function handleCredentialsSubmit(email: string, password: string) {
    const result = await login(email, password)

    if (result.twoFactorRequired) {
      setPendingEmail(result.email)
      return
    }

    navigate('/dashboard')
  }

  async function handleTwoFactorSubmit(code: string) {
    if (!pendingEmail) {
      return
    }

    await verifyTwoFactor(pendingEmail, code)
    navigate('/dashboard')
  }

  function handleResend() {
    if (!pendingEmail) {
      return Promise.resolve('')
    }

    return resendTwoFactorCode(pendingEmail)
  }

  return (
    <PublicLayout actionLabel="Regresar" onAction={() => navigate('/')}>
      <SplitSection
        leftBackground="accent"
        left={<Logo size="lg" />}
        right={
          pendingEmail ? (
            <TwoFactorForm
              email={pendingEmail}
              onSubmit={handleTwoFactorSubmit}
              onResend={handleResend}
              onBack={() => setPendingEmail(null)}
            />
          ) : (
            <LoginForm onSubmit={handleCredentialsSubmit} />
          )
        }
      />
    </PublicLayout>
  )
}
