import { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { CategoryFilterChips, type CategoryFilterOption } from '@/components/molecules/CategoryFilterChips'
import { DishMenuCard } from '@/components/organisms/DishMenuCard'
import type { PublicDish } from '@/types/dish'
import styles from './MenuShowcase.module.css'

interface MenuShowcaseProps {
  dishes: PublicDish[]
  isLoading: boolean
  hasError: boolean
  onRetry: () => void
}

const SKELETON_COUNT = 3

export function MenuShowcase({ dishes, isLoading, hasError, onRetry }: MenuShowcaseProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const categoryOptions = useMemo<CategoryFilterOption[]>(() => {
    const byCategory = new Map<number, CategoryFilterOption>()

    for (const dish of dishes) {
      if (!dish.category) {
        continue
      }

      const option = byCategory.get(dish.category.id)
      byCategory.set(dish.category.id, {
        id: dish.category.id,
        label: dish.category.name,
        count: (option?.count ?? 0) + 1,
      })
    }

    return [
      { id: null, label: 'Todos', count: dishes.length },
      ...[...byCategory.values()].sort((a, b) => a.label.localeCompare(b.label, 'es')),
    ]
  }, [dishes])

  // Si la categoría elegida deja de existir (por ejemplo tras recargar), se muestra todo el menú.
  const activeCategoryId = categoryOptions.some((option) => option.id === selectedCategoryId)
    ? selectedCategoryId
    : null

  const visibleDishes =
    activeCategoryId === null
      ? dishes
      : dishes.filter((dish) => dish.category?.id === activeCategoryId)

  if (isLoading) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Cargando el menú del día">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <div key={index} className={styles.skeleton} aria-hidden="true" />
        ))}
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={styles.message} role="alert">
        <span className={styles.messageIcon} aria-hidden="true">
          😕
        </span>
        <p className={styles.messageTitle}>No pudimos cargar el menú</p>
        <p className={styles.messageText}>Revisa tu conexión e inténtalo de nuevo.</p>
        <Button type="button" variant="primary" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (dishes.length === 0) {
    return (
      <div className={styles.message}>
        <span className={styles.messageIcon} aria-hidden="true">
          🍽️
        </span>
        <p className={styles.messageTitle}>Estamos preparando el menú de hoy</p>
        <p className={styles.messageText}>Aún no hay platillos publicados. ¡Vuelve en un rato!</p>
      </div>
    )
  }

  return (
    <div className={styles.showcase}>
      {categoryOptions.length > 2 && (
        <CategoryFilterChips
          label="Filtrar el menú por categoría"
          options={categoryOptions}
          selectedId={activeCategoryId}
          onChange={setSelectedCategoryId}
        />
      )}
      <ul className={styles.grid}>
        {visibleDishes.map((dish) => (
          <li key={dish.id} className={styles.item}>
            <DishMenuCard dish={dish} />
          </li>
        ))}
      </ul>
    </div>
  )
}
