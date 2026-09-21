import type { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...rest }: SelectProps) {
  return (
    <select className={[styles.select, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </select>
  )
}
