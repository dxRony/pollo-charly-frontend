import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import { NavDropdownTab } from '@/components/molecules/NavDropdownTab'
import styles from './DashboardNavBar.module.css'

export interface DashboardTab {
  label: string
  icon?: string
  hasSubmenu?: boolean
  to?: string
}

interface DashboardNavBarProps {
  tabs: DashboardTab[]
  onProfile: () => void
  onLogout: () => void
}

export function DashboardNavBar({ tabs, onProfile, onLogout }: DashboardNavBarProps) {
  return (
    <nav className={styles.nav}>
      <Link to="/dashboard" className={styles.logoLink} aria-label="Ir al panel principal">
        <Logo size="sm" />
      </Link>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <NavDropdownTab
            key={tab.label}
            label={tab.label}
            icon={tab.icon}
            hasSubmenu={tab.hasSubmenu}
            to={tab.to}
          />
        ))}
      </div>
      <Button size="sm" onClick={onProfile}>
        Mi Perfil
      </Button>
      <Button size="sm" onClick={onLogout}>
        Cerrar Sesión
      </Button>
    </nav>
  )
}
