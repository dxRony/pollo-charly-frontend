import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { SplitSection } from '@/components/molecules/SplitSection'
import { MenuCard } from '@/components/organisms/MenuCard'
import { PublicLayout } from '@/components/templates/PublicLayout'

const MENU_ITEMS = ['Platillo 1', 'Platillo 2', 'Platillo 3', 'Platillo n']

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <PublicLayout actionLabel="Iniciar Sesión" onAction={() => navigate('/login')}>
      <SplitSection
        leftBackground="accent"
        left={<Logo size="lg" />}
        right={<MenuCard items={MENU_ITEMS} />}
      />
    </PublicLayout>
  )
}
