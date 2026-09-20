import type { ReactNode } from 'react'
import styles from './BulletListItem.module.css'

interface BulletListItemProps {
  children: ReactNode
}

export function BulletListItem({ children }: BulletListItemProps) {
  return (
    <div className={styles.item}>
      <span className={styles.bullet} aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
