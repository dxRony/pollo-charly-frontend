import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import { MenuToggleButton } from '@/components/atoms/MenuToggleButton'
import { NavGroupMenu, type NavGroupItem } from '@/components/molecules/NavGroupMenu'
import { NavTab } from '@/components/molecules/NavTab'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './DashboardNavBar.module.css'

export interface DashboardNavLink {
  label: string
  icon?: string
  to: string
}

export interface DashboardNavGroup {
  label: string
  icon?: string
  items: NavGroupItem[]
}

export type DashboardTab = DashboardNavLink | DashboardNavGroup

interface DashboardNavBarProps {
  tabs: DashboardTab[]
  onProfile: () => void
  onLogout: () => void
}

/** Debe coincidir con el punto de corte de DashboardNavBar.module.css. */
const MOBILE_QUERY = '(max-width: 900px)'

export function DashboardNavBar({ tabs, onProfile, onLogout }: DashboardNavBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Los grupos se reinician cada vez que se abre el menú lateral o cambia entre móvil y escritorio
  // (colapsados, salvo la sección actual en el menú lateral).
  const [openCount, setOpenCount] = useState(0)
  const isMobile = useMediaQuery(MOBILE_QUERY)

  // Al pasar a pantalla ancha el menú lateral se cierra; si no, reaparecería abierto al volver a una pantalla angosta.
  if (!isMobile && isOpen) {
    setIsOpen(false)
  }

  const isDrawerOpen = isMobile && isOpen
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(menuRef, isDrawerOpen)

  useEffect(() => {
    if (!isDrawerOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDrawerOpen])

  function closeDrawer() {
    setIsOpen(false)
    toggleRef.current?.focus()
  }

  function handleMenuClick(event: MouseEvent<HTMLDivElement>) {
    // Al elegir una página en el menú lateral, este se cierra.
    if (isMobile && (event.target as HTMLElement).closest('a')) {
      setIsOpen(false)
    }
  }

  function handleAction(action: () => void) {
    setIsOpen(false)
    action()
  }

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      <Link to="/dashboard" className={styles.logoLink} aria-label="Ir al panel principal">
        <Logo size="sm" />
      </Link>
      <span className={styles.brand}>Pollo Charly</span>
      <MenuToggleButton
        ref={toggleRef}
        className={styles.toggle}
        aria-label="Abrir menú de navegación"
        aria-expanded={isDrawerOpen}
        aria-controls={menuId}
        onClick={() => {
          setOpenCount((count) => count + 1)
          setIsOpen(true)
        }}
      />

      {isDrawerOpen && <div className={styles.backdrop} onClick={closeDrawer} aria-hidden="true" />}

      <div
        id={menuId}
        ref={menuRef}
        className={[styles.menu, isDrawerOpen ? styles.menuOpen : ''].filter(Boolean).join(' ')}
        role={isDrawerOpen ? 'dialog' : undefined}
        aria-modal={isDrawerOpen ? true : undefined}
        aria-label={isDrawerOpen ? 'Menú de navegación' : undefined}
        onClick={handleMenuClick}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menú</span>
          <button ref={closeRef} type="button" className={styles.closeButton} aria-label="Cerrar menú" onClick={closeDrawer}>
            ✕
          </button>
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab) =>
            'items' in tab ? (
              <NavGroupMenu key={`${tab.label}-${openCount}-${isMobile}`} label={tab.label} icon={tab.icon} items={tab.items} />
            ) : (
              <NavTab key={tab.label} label={tab.label} icon={tab.icon} to={tab.to} />
            ),
          )}
        </div>
        <div className={styles.actions}>
          <Button size="sm" onClick={() => handleAction(onProfile)}>
            Mi Perfil
          </Button>
          <Button size="sm" onClick={() => handleAction(onLogout)}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  )
}
