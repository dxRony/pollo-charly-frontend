import { Button } from '@/components/atoms/Button'
import styles from './PublicHeader.module.css'

interface PublicHeaderProps {
  actionLabel: string
  onAction: () => void
}

export function PublicHeader({ actionLabel, onAction }: PublicHeaderProps) {
  return (
    <header className={styles.header}>
      <Button size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </header>
  )
}
