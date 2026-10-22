import type { ReactNode } from 'react'
import { Badge } from '@/components/atoms/Badge'
import styles from './DashboardHero.module.css'

interface DashboardHeroProps {
  userName: string
  roleName: string
  subtitle: string
  actions?: ReactNode
}

export function DashboardHero({ userName, roleName, subtitle, actions }: DashboardHeroProps) {
  const todayFormatted = new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <section className={styles.hero} aria-label="Información de bienvenida">
      <div className={styles.info}>
        <div className={styles.topRow}>
          <Badge tone="accent">{roleName}</Badge>
          <span className={styles.date}>📅 {todayFormatted}</span>
        </div>
        <h1 className={styles.title}>
          ¡Hola, <span className={styles.nameHighlight}>{userName}</span>! 👋
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  )
}
