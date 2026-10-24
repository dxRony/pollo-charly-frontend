import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './NavGroupMenu.module.css'

export interface NavGroupItem {
  label: string
  icon?: string
  to: string
}

interface NavGroupMenuProps {
  label: string
  icon?: string
  items: NavGroupItem[]
}

export function NavGroupMenu({ label, icon, items }: NavGroupMenuProps) {
  const { pathname } = useLocation()
  // En pantallas angostas el grupo es un acordeón dentro del menú lateral: no se cierra solo al perder el foco.
  const isInline = useMediaQuery('(max-width: 900px)')
  const isActive = items.some((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))

  // En el acordeón, la sección actual aparece expandida al abrir el menú.
  const [isOpen, setIsOpen] = useState(() => isInline && isActive)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!isOpen || isInline) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isInline])

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    // Cierra el menú cuando el foco sale del grupo (por ejemplo, al avanzar con Tab).
    if (!isInline && !event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={styles.group} onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        className={[styles.trigger, isActive ? styles.active : ''].filter(Boolean).join(' ')}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{label}</span>
        <span className={[styles.arrow, isOpen ? styles.arrowOpen : ''].filter(Boolean).join(' ')} aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <ul id={panelId} className={styles.panel}>
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive: isItemActive }) =>
                  `${styles.link} ${isItemActive ? styles.linkActive : ''}`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.icon && (
                  <span className={styles.linkIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
