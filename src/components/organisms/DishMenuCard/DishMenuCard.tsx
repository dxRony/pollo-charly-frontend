import { Badge } from '@/components/atoms/Badge'
import { PhotoFrame } from '@/components/atoms/PhotoFrame'
import type { PublicDish } from '@/types/dish'
import { formatCurrency } from '@/utils/formatCurrency'
import styles from './DishMenuCard.module.css'

interface DishMenuCardSelection {
  isSelected: boolean
  hasPendingChange: boolean
  onToggle: () => void
}

interface DishMenuCardProps {
  dish: PublicDish
  /** Si se indica, la tarjeta completa funciona como casilla para incluir el platillo en el menú. */
  selection?: DishMenuCardSelection
}

export function DishMenuCard({ dish, selection }: DishMenuCardProps) {
  const className = [
    styles.card,
    selection ? styles.selectable : '',
    selection?.isSelected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <div className={styles.media}>
        <PhotoFrame src={dish.image_url} alt={dish.name} />
        <span className={styles.price}>{formatCurrency(dish.price)}</span>
        {selection && (
          <span className={styles.toggle}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selection.isSelected}
              onChange={selection.onToggle}
              aria-label={`Incluir ${dish.name} en el menú del día`}
            />
            <span className={styles.toggleText}>{selection.isSelected ? 'En el menú' : 'Agregar'}</span>
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.tags}>
          {dish.category && <Badge tone="accent">{dish.category.name}</Badge>}
          {selection?.hasPendingChange && <Badge tone="warning">Cambio sin publicar</Badge>}
        </div>
        <h3 className={styles.name}>{dish.name}</h3>
        {dish.description ? (
          <p className={styles.description}>{dish.description}</p>
        ) : (
          <p className={styles.noDescription}>Sin descripción</p>
        )}

        {dish.complements.length > 0 && (
          <div className={styles.extras}>
            <span className={styles.extrasLabel}>Complementos</span>
            <ul className={styles.extrasList}>
              {dish.complements.map((complement) => (
                <li key={complement.id} className={styles.extra}>
                  {complement.name}
                  {complement.extra_price > 0 && (
                    <span className={styles.extraPrice}>+{formatCurrency(complement.extra_price)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )

  return selection ? (
    <label className={className}>{content}</label>
  ) : (
    <article className={className}>{content}</article>
  )
}
