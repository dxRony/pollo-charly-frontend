import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import { NavDropdownTab } from '@/components/molecules/NavDropdownTab'
import styles from './DashboardNavBar.module.css'

export interface DashboardTab {
  label: string
  icon?: string
  hasSubmenu?: boolean
}

interface DashboardNavBarProps {
  tabs: DashboardTab[]
  onLogout: () => void
}

export function DashboardNavBar({ tabs, onLogout }: DashboardNavBarProps) {
  return (
    <nav className={styles.nav}>
      <Logo size="sm" />
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <NavDropdownTab
            key={tab.label}
            label={tab.label}
            icon={tab.icon}
            hasSubmenu={tab.hasSubmenu}
          />
        ))}
      </div>
      <Button size="sm" onClick={onLogout}>
        Cerrar Sesión
      </Button>
    </nav>
  )
}
