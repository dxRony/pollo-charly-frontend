import type { ReactNode } from 'react'
import styles from './SplitSection.module.css'

interface SplitSectionProps {
  left: ReactNode
  right: ReactNode
  leftBackground?: 'accent' | 'plain'
}

export function SplitSection({ left, right, leftBackground = 'plain' }: SplitSectionProps) {
  const leftBgClass = leftBackground === 'accent' ? styles.accentBg : styles.plainBg

  return (
    <div className={styles.section}>
      <div className={`${styles.column} ${leftBgClass}`}>{left}</div>
      <div className={`${styles.column} ${styles.plainBg}`}>{right}</div>
    </div>
  )
}
