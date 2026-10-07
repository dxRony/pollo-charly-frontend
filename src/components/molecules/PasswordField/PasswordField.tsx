import { useState, type InputHTMLAttributes } from 'react'
import { FormField } from '@/components/molecules/FormField'
import styles from './PasswordField.module.css'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

export function PasswordField({ label, error, ...inputProps }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <FormField
      {...inputProps}
      label={label}
      error={error}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={isVisible}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
            {isVisible && <path d="M3 3l18 18" />}
          </svg>
        </button>
      }
    />
  )
}
