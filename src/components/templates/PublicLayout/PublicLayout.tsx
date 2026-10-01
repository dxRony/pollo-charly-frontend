import type { ReactNode } from 'react'
import { PublicHeader } from '@/components/organisms/PublicHeader'
import { SiteFooter } from '@/components/organisms/SiteFooter'
import styles from './PublicLayout.module.css'

interface PublicLayoutProps {
  children: ReactNode
  actionLabel: string
  onAction: () => void
}

export function PublicLayout({ children, actionLabel, onAction }: PublicLayoutProps) {
  return (
    <div className={styles.layout}>
      <PublicHeader actionLabel={actionLabel} onAction={onAction} />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </div>
  )
}
