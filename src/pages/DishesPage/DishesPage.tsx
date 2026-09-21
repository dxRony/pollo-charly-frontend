import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { DishesFilterBar } from '@/components/organisms/DishesFilterBar'
import { DishesTable } from '@/components/organisms/DishesTable'
import { DishFormModal } from '@/components/organisms/DishFormModal'
import { useDishes } from '@/hooks/useDishes'
import { useCategories } from '@/hooks/useCategories'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import { useActiveComplements } from '@/hooks/useActiveComplements'
import * as dishService from '@/services/dishService'
import type { CreateDishPayload, Dish, UpdateDishPayload } from '@/types/dish'
import styles from './DishesPage.module.css'

type ModalState = { mode: 'create' } | { mode: 'edit'; dish: Dish } | null

export function DishesPage() {
  const { dishes, pagination, filters, isLoading, error, updateFilters, setPage, refetch } = useDishes()
  const { categories } = useCategories()
  const { supplies } = useActiveSupplies()
  const { complements } = useActiveComplements()
  const [modalState, setModalState] = useState<ModalState>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleFormSubmit(payload: CreateDishPayload | UpdateDishPayload) {
    if (modalState?.mode === 'edit') {
      await dishService.updateDish(modalState.dish.id, payload as UpdateDishPayload)
    } else {
      await dishService.createDish(payload as CreateDishPayload)
    }
    setModalState(null)
    await refetch()
  }

  async function handleToggleStatus(dish: Dish) {
    setActionError(null)
    try {
      await dishService.toggleDishStatus(dish.id, !dish.is_active)
      await refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo cambiar el estado del platillo.')
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Gestión de platillos</h1>

      <DishesFilterBar
        search={filters.search ?? ''}
        categoryId={filters.category_id ?? ''}
        isActive={filters.is_active === undefined ? '' : String(filters.is_active)}
        categories={categories}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onCategoryChange={(value) => updateFilters({ category_id: value === '' ? undefined : value })}
        onStatusChange={(value) =>
          updateFilters({ is_active: value === '' ? undefined : value === 'true' })
        }
        onCreateClick={() => setModalState({ mode: 'create' })}
      />

      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando platillos...</p>
      ) : (
        <DishesTable
          dishes={dishes}
          onEdit={(dish) => setModalState({ mode: 'edit', dish })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {pagination && pagination.lastPage > 1 && (
        <div className={styles.pagination}>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage <= 1}
            onClick={() => setPage(pagination.currentPage - 1)}
          >
            Anterior
          </Button>
          <span className={styles.pageInfo}>
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => setPage(pagination.currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {modalState && (
        <DishFormModal
          mode={modalState.mode}
          categories={categories}
          availableSupplies={supplies}
          availableComplements={complements}
          initialDish={modalState.mode === 'edit' ? modalState.dish : undefined}
          onClose={() => setModalState(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
