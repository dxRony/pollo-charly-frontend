import { forwardRef, type ButtonHTMLAttributes } from 'react'
import styles from './MenuToggleButton.module.css'

type MenuToggleButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'>

/** Botón de "hamburguesa" para abrir o cerrar un menú. */
export const MenuToggleButton = forwardRef<HTMLButtonElement, MenuToggleButtonProps>(
  function MenuToggleButton({ className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={[styles.button, className].filter(Boolean).join(' ')}
        {...rest}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    )
  },
)
