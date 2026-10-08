import { useEffect, useRef } from 'react'
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
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tabsRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <nav className={styles.nav}>
      <Link to="/dashboard" className={styles.logoLink} aria-label="Ir al panel principal">
        <Logo size="sm" />
      </Link>
      <div ref={tabsRef} className={styles.tabs}>
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
