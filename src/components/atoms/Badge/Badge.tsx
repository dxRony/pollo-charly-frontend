import type { ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  tone?: 'success' | 'neutral' | 'warning'
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={[styles.badge, styles[tone]].join(' ')}>{children}</span>
}
