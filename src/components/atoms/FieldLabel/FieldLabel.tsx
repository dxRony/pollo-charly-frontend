import type { LabelHTMLAttributes } from 'react'
import styles from './FieldLabel.module.css'

type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function FieldLabel({ className, ...rest }: FieldLabelProps) {
  return <label className={[styles.label, className].filter(Boolean).join(' ')} {...rest} />
}
