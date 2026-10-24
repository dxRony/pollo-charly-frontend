import { NavLink } from 'react-router-dom'
import styles from './NavTab.module.css'

interface NavTabProps {
  label: string
  icon?: string
  to: string
}

export function NavTab({ label, icon, to }: NavTabProps) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </NavLink>
  )
}
