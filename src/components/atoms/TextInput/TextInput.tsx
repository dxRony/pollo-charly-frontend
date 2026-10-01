import type { InputHTMLAttributes } from 'react'
import styles from './TextInput.module.css'

type TextInputProps = InputHTMLAttributes<HTMLInputElement>

export function TextInput({ className, ...rest }: TextInputProps) {
  return <input className={[styles.input, className].filter(Boolean).join(' ')} {...rest} />
}
