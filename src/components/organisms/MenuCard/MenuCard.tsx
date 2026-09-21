import { BulletListItem } from '@/components/atoms/BulletListItem'
import styles from './MenuCard.module.css'

export interface MenuCardItem {
  id: number
  name: string
  price?: number
}

interface MenuCardProps {
  items: MenuCardItem[]
  emptyMessage?: string
}

export function MenuCard({
  items,
  emptyMessage = 'Aún no hay platillos publicados en el menú del día.',
}: MenuCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.titleBar}>
        <span aria-hidden="true">🍽️</span>
        <h2 className={styles.title}>Menú del día:</h2>
      </div>
      <div className={styles.list}>
        {items.length === 0 ? (
          <p className={styles.empty}>{emptyMessage}</p>
        ) : (
          items.map((item) => (
            <BulletListItem key={item.id}>
              <span className={styles.itemRow}>
                <span className={styles.itemName}>{item.name}</span>
                {item.price !== undefined && (
                  <span className={styles.itemPrice}>{item.price.toFixed(2)}</span>
                )}
              </span>
            </BulletListItem>
          ))
        )}
      </div>
    </div>
  )
}
