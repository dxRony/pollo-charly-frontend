import { NavLink } from 'react-router-dom'
import styles from './NavDropdownTab.module.css'

interface NavDropdownTabProps {
  label: string
  icon?: string
  hasSubmenu?: boolean
  to?: string
}

export function NavDropdownTab({ label, icon = '👤', hasSubmenu = true, to }: NavDropdownTabProps) {
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
      {hasSubmenu && (
        <span className={styles.arrow} aria-hidden="true">
          ▶
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <NavLink
        to={to}
        end={to === '/dashboard'}
        className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
      >
        {content}
      </NavLink>
    )
  }

  return (
    <button type="button" className={styles.tab}>
      {content}
    </button>
  )
}
