import { BulletListItem } from '@/components/atoms/BulletListItem'
import styles from './MenuCard.module.css'

interface MenuCardProps {
  items: string[]
}

export function MenuCard({ items }: MenuCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.titleBar}>
        <span aria-hidden="true">🍽️</span>
        <h2 className={styles.title}>Menú del día:</h2>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <BulletListItem key={item}>{item}</BulletListItem>
        ))}
      </div>
    </div>
  )
}
