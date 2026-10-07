import { useMemo, useState } from 'react'
import type { CategoryFilterOption } from '@/components/molecules/CategoryFilterChips'
import { DailyMenuFilters } from '@/components/organisms/DailyMenuFilters'
import { DailyMenuSummary } from '@/components/organisms/DailyMenuSummary'
import { DishMenuCard } from '@/components/organisms/DishMenuCard'
import { useActiveDishes } from '@/hooks/useActiveDishes'
import * as dailyMenuService from '@/services/dailyMenuService'
import { ApiError } from '@/services/api'
import type { Dish } from '@/types/dish'
import styles from './DailyMenuPage.module.css'

export function DailyMenuPage() {
  const { dishes, isLoading, refetch } = useActiveDishes()
  const [overrides, setOverrides] = useState<Record<number, boolean>>({})
  const [search, setSearch] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [onlySelected, setOnlySelected] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function isSelected(dish: Dish): boolean {
    return overrides[dish.id] ?? dish.is_daily_menu
  }

  function hasPendingChange(dish: Dish): boolean {
    return isSelected(dish) !== dish.is_daily_menu
  }

  function setSelected(dish: Dish, selected: boolean) {
    setOverrides((previous) => ({ ...previous, [dish.id]: selected }))
    setSuccessMessage(null)
  }

  const selectedDishes = dishes.filter(isSelected)
  const pendingChangesCount = dishes.filter(hasPendingChange).length

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

  const normalizedSearch = search.trim().toLowerCase()
  const visibleDishes = dishes.filter((dish) => {
    if (selectedCategoryId !== null && dish.category_id !== selectedCategoryId) {
      return false
    }

    if (onlySelected && !isSelected(dish)) {
      return false
    }

    return (
      normalizedSearch === '' ||
      dish.name.toLowerCase().includes(normalizedSearch) ||
      (dish.description ?? '').toLowerCase().includes(normalizedSearch)
    )
  })

  async function handlePublish() {
    setErrors([])
    setSuccessMessage(null)
    setIsPublishing(true)

    try {
      const response = await dailyMenuService.updateDailyMenu(selectedDishes.map((dish) => dish.id))
      setSuccessMessage(response.message)
      setOverrides({})
      await refetch()
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors(Object.values(err.errors).flat())
      } else {
        setErrors([err instanceof Error ? err.message : 'No se pudo publicar el menú del día.'])
      }
    } finally {
      setIsPublishing(false)
    }
  }

  function handleDiscard() {
    setOverrides({})
    setErrors([])
    setSuccessMessage(null)
  }

  return (
    <div>
      <h1 className={styles.title}>Menú del día</h1>
      <p className={styles.hint}>
        Elige los platillos que se mostrarán en la página principal. Las tarjetas son tal como las verán
        los clientes.
      </p>

      {errors.length > 0 && (
        <div className={styles.error} role="alert">
          <p className={styles.errorTitle}>No se pudo publicar el menú:</p>
          <ul className={styles.errorList}>
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      {successMessage && (
        <p className={styles.success} role="status">
          {successMessage}
        </p>
      )}

      <div className={styles.layout}>
        <div className={styles.content}>
          <DailyMenuFilters
            search={search}
            categoryOptions={categoryOptions}
            selectedCategoryId={selectedCategoryId}
            onlySelected={onlySelected}
            selectedCount={selectedDishes.length}
            onSearchChange={setSearch}
            onCategoryChange={setSelectedCategoryId}
            onOnlySelectedChange={setOnlySelected}
          />

          {isLoading ? (
            <p className={styles.loading}>Cargando platillos...</p>
          ) : dishes.length === 0 ? (
            <p className={styles.empty}>No hay platillos activos registrados.</p>
          ) : visibleDishes.length === 0 ? (
            <p className={styles.empty}>Ningún platillo coincide con los filtros seleccionados.</p>
          ) : (
            <ul className={styles.grid}>
              {visibleDishes.map((dish) => (
                <li key={dish.id} className={styles.item}>
                  <DishMenuCard
                    dish={dish}
                    selection={{
                      isSelected: isSelected(dish),
                      hasPendingChange: hasPendingChange(dish),
                      onToggle: () => setSelected(dish, !isSelected(dish)),
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.summary}>
          <DailyMenuSummary
            selectedDishes={selectedDishes}
            totalDishes={dishes.length}
            pendingChangesCount={pendingChangesCount}
            isPublishing={isPublishing}
            onRemove={(dish) => setSelected(dish, false)}
            onPublish={handlePublish}
            onDiscard={handleDiscard}
          />
        </div>
      </div>
    </div>
  )
}
