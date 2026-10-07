import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { MenuShowcase } from '@/components/organisms/MenuShowcase'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { usePublicDailyMenu } from '@/hooks/usePublicDailyMenu'
import { formatLongDate } from '@/utils/formatLongDate'
import styles from './LandingPage.module.css'

export function LandingPage() {
  const navigate = useNavigate()
  const { dishes, isLoading, hasError, refetch } = usePublicDailyMenu()

  const dishCountLabel = dishes.length === 1 ? '1 platillo' : `${dishes.length} platillos`

  return (
    <PublicLayout actionLabel="Iniciar Sesión" onAction={() => navigate('/login')}>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="menu-title">
          <div className={styles.heroInner}>
            <Logo size="md" />
            <div className={styles.heroText}>
              <p className={styles.eyebrow}>Hoy en Pollo Charly</p>
              <h1 id="menu-title" className={styles.title}>
                Menú del día
              </h1>
              <p className={styles.subtitle}>
                <time dateTime={new Date().toISOString().slice(0, 10)}>{formatLongDate(new Date())}</time>
                {!isLoading && !hasError && dishes.length > 0 && (
                  <span className={styles.count}>{dishCountLabel} disponibles</span>
                )}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.menu} aria-label="Platillos del menú del día">
          <MenuShowcase dishes={dishes} isLoading={isLoading} hasError={hasError} onRetry={refetch} />
        </section>
      </div>
    </PublicLayout>
  )
}
