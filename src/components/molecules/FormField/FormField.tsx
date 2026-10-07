import type { InputHTMLAttributes, ReactNode } from 'react'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import { TextInput } from '@/components/atoms/TextInput'
import styles from './FormField.module.css'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  endAdornment?: ReactNode
}

export function FormField({ label, error, id, endAdornment, ...inputProps }: FormFieldProps) {
  const controlClassName = [styles.control, endAdornment ? styles.hasAdornment : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.field}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className={controlClassName}>
        <TextInput id={id} {...inputProps} />
        {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
