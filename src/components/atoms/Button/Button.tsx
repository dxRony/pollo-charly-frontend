import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'md' | 'sm'
  variant?: 'accent' | 'primary'
}

export function Button({ size = 'md', variant = 'accent', className, ...rest }: ButtonProps) {
  const classes = [styles.button, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} {...rest} />
}
