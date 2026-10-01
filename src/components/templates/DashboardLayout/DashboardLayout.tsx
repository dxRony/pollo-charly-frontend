import type { ReactNode } from 'react'
import { DashboardNavBar, type DashboardTab } from '@/components/organisms/DashboardNavBar'
import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: ReactNode
  tabs: DashboardTab[]
  onProfile: () => void
  onLogout: () => void
}

export function DashboardLayout({ children, tabs, onProfile, onLogout }: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <DashboardNavBar tabs={tabs} onProfile={onProfile} onLogout={onLogout} />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Charly Pollo Frito - 100% Súper Chivo. Todos los derechos
        reservados.
      </footer>
    </div>
  )
}
