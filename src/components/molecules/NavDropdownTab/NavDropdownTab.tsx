import styles from './NavDropdownTab.module.css'

interface NavDropdownTabProps {
  label: string
  icon?: string
  hasSubmenu?: boolean
}

export function NavDropdownTab({ label, icon = '👤', hasSubmenu = true }: NavDropdownTabProps) {
  return (
    <button type="button" className={styles.tab}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
      {hasSubmenu && (
        <span className={styles.arrow} aria-hidden="true">
          ▶
        </span>
      )}
    </button>
  )
}
