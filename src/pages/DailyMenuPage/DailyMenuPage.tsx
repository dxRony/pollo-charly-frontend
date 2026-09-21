import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { MenuCard } from '@/components/organisms/MenuCard'
import { useActiveDishes } from '@/hooks/useActiveDishes'
import * as dailyMenuService from '@/services/dailyMenuService'
import { ApiError } from '@/services/api'
import type { Dish } from '@/types/dish'
import styles from './DailyMenuPage.module.css'

export function DailyMenuPage() {
  const { dishes, isLoading, refetch } = useActiveDishes()
  const [overrides, setOverrides] = useState<Record<number, boolean>>({})
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function isSelected(dish: Dish): boolean {
    return overrides[dish.id] ?? dish.is_daily_menu
  }

  function toggle(dish: Dish) {
    setOverrides((previous) => ({ ...previous, [dish.id]: !isSelected(dish) }))
    setSuccessMessage(null)
  }

  const previewItems = dishes
    .filter(isSelected)
    .map((dish) => ({ id: dish.id, name: dish.name, price: dish.price }))

  async function handlePublish() {
    setError(null)
    setSuccessMessage(null)
    setIsPublishing(true)

    try {
      const dishIds = dishes.filter(isSelected).map((dish) => dish.id)
      const response = await dailyMenuService.updateDailyMenu(dishIds)
      setSuccessMessage(response.message)
      setOverrides({})
      await refetch()
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setError(Object.values(err.errors).flat().join(' '))
      } else {
        setError(err instanceof Error ? err.message : 'No se pudo publicar el menú del día.')
      }
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Menú del día</h1>
      <p className={styles.hint}>
        Selecciona los platillos activos que se destacarán en la landing page. Solo se publican si
        cuentan con insumos suficientes en almacén.
      </p>

      <div className={styles.layout}>
        <div className={styles.listPanel}>
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          {isLoading ? (
            <p className={styles.loading}>Cargando platillos...</p>
          ) : dishes.length === 0 ? (
            <p className={styles.empty}>No hay platillos activos registrados.</p>
          ) : (
            <ul className={styles.dishList}>
              {dishes.map((dish) => (
                <li key={dish.id} className={styles.dishItem}>
                  <label className={styles.dishLabel}>
                    <input type="checkbox" checked={isSelected(dish)} onChange={() => toggle(dish)} />
                    <span className={styles.dishName}>{dish.name}</span>
                    <span className={styles.dishMeta}>
                      {dish.category?.name ?? '—'} · {dish.price.toFixed(2)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          <Button
            type="button"
            variant="primary"
            onClick={handlePublish}
            disabled={isPublishing || isLoading}
          >
            {isPublishing ? 'Publicando...' : 'Publicar cambios'}
          </Button>
        </div>

        <div className={styles.previewPanel}>
          <p className={styles.previewLabel}>Previsualización de la landing page</p>
          <MenuCard items={previewItems} />
        </div>
      </div>
    </div>
  )
}
