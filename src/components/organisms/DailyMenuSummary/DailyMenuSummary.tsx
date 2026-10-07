import { Button } from '@/components/atoms/Button'
import { PhotoFrame } from '@/components/atoms/PhotoFrame'
import type { Dish } from '@/types/dish'
import { formatCurrency } from '@/utils/formatCurrency'
import styles from './DailyMenuSummary.module.css'

interface DailyMenuSummaryProps {
  selectedDishes: Dish[]
  totalDishes: number
  pendingChangesCount: number
  isPublishing: boolean
  onRemove: (dish: Dish) => void
  onPublish: () => void
  onDiscard: () => void
}

export function DailyMenuSummary({
  selectedDishes,
  totalDishes,
  pendingChangesCount,
  isPublishing,
  onRemove,
  onPublish,
  onDiscard,
}: DailyMenuSummaryProps) {
  const hasPendingChanges = pendingChangesCount > 0

  return (
    <aside className={styles.summary} aria-label="Resumen del menú del día">
      <div className={styles.header}>
        <p className={styles.count}>{selectedDishes.length}</p>
        <p className={styles.countLabel}>
          {selectedDishes.length === 1 ? 'platillo en el menú' : 'platillos en el menú'}
          <span className={styles.total}>de {totalDishes} activos</span>
        </p>
      </div>

      {hasPendingChanges ? (
        <p className={styles.pending} role="status">
          {pendingChangesCount === 1
            ? 'Tienes 1 cambio sin publicar.'
            : `Tienes ${pendingChangesCount} cambios sin publicar.`}
        </p>
      ) : (
        <p className={styles.upToDate}>El menú publicado está al día.</p>
      )}

      {selectedDishes.length === 0 ? (
        <p className={styles.empty}>Selecciona platillos para armar el menú de hoy.</p>
      ) : (
        <ul className={styles.list}>
          {selectedDishes.map((dish) => (
            <li key={dish.id} className={styles.item}>
              <PhotoFrame src={dish.image_url} alt={dish.name} ratio="square" className={styles.thumb} />
              <span className={styles.itemText}>
                <span className={styles.itemName}>{dish.name}</span>
                <span className={styles.itemPrice}>{formatCurrency(dish.price)}</span>
              </span>
              <button
                type="button"
                className={styles.remove}
                aria-label={`Quitar ${dish.name} del menú`}
                onClick={() => onRemove(dish)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="primary" onClick={onPublish} disabled={isPublishing || !hasPendingChanges}>
          {isPublishing ? 'Publicando...' : 'Publicar cambios'}
        </Button>
        {hasPendingChanges && !isPublishing && (
          <Button type="button" onClick={onDiscard}>
            Descartar cambios
          </Button>
        )}
      </div>

      <p className={styles.note}>
        Solo se publican los platillos activos con insumos suficientes en almacén.
      </p>
    </aside>
  )
}
