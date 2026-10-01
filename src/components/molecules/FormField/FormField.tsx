import type { InputHTMLAttributes } from 'react'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import { TextInput } from '@/components/atoms/TextInput'
import styles from './FormField.module.css'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <TextInput id={id} {...inputProps} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
