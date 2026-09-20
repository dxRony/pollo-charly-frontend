import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { SplitSection } from '@/components/molecules/SplitSection'
import { LoginForm } from '@/components/organisms/LoginForm'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  async function handleSubmit(email: string, password: string) {
    await login(email, password)
    navigate('/dashboard')
  }

  return (
    <PublicLayout actionLabel="Regresar" onAction={() => navigate('/')}>
      <SplitSection leftBackground="accent" left={<Logo size="lg" />} right={<LoginForm onSubmit={handleSubmit} />} />
    </PublicLayout>
  )
}
