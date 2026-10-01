import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { SplitSection } from '@/components/molecules/SplitSection'
import { MenuCard } from '@/components/organisms/MenuCard'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { usePublicDailyMenu } from '@/hooks/usePublicDailyMenu'

export function LandingPage() {
  const navigate = useNavigate()
  const { dishes } = usePublicDailyMenu()

  const menuItems = dishes.map((dish) => ({ id: dish.id, name: dish.name, price: dish.price }))

  return (
    <PublicLayout actionLabel="Iniciar Sesión" onAction={() => navigate('/login')}>
      <SplitSection
        leftBackground="accent"
        left={<Logo size="lg" />}
        right={<MenuCard items={menuItems} />}
      />
    </PublicLayout>
  )
}
