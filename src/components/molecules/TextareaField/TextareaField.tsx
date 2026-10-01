import type { TextareaHTMLAttributes } from 'react'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import { Textarea } from '@/components/atoms/Textarea'
import styles from './TextareaField.module.css'

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextareaField({ label, error, id, ...textareaProps }: TextareaFieldProps) {
  return (
    <div className={styles.field}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea id={id} {...textareaProps} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
