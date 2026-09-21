import type { ReactNode, SelectHTMLAttributes } from 'react'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import { Select } from '@/components/atoms/Select'
import styles from './SelectField.module.css'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: ReactNode
}

export function SelectField({ label, error, id, children, ...selectProps }: SelectFieldProps) {
  return (
    <div className={styles.field}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select id={id} {...selectProps}>
        {children}
      </Select>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
