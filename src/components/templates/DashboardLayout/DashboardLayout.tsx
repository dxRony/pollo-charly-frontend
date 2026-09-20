import type { ReactNode } from 'react'
import { DashboardNavBar, type DashboardTab } from '@/components/organisms/DashboardNavBar'
import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps {
  children: ReactNode
  tabs: DashboardTab[]
  onLogout: () => void
}

export function DashboardLayout({ children, tabs, onLogout }: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <DashboardNavBar tabs={tabs} onLogout={onLogout} />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Charly Pollo Frito - 100% Súper Chivo. Todos los derechos
        reservados.
      </footer>
    </div>
  )
}
