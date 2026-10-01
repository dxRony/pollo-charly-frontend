import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import type { Dish } from '@/types/dish'
import styles from './DishesTable.module.css'

interface DishesTableProps {
  dishes: Dish[]
  onEdit: (dish: Dish) => void
  onToggleStatus: (dish: Dish) => void
}

function formatRecipe(dish: Dish): string {
  if (dish.recipes.length === 0) {
    return '—'
  }

  return dish.recipes
    .map((line) => `${line.supply_name ?? '—'} (${line.required_quantity} ${line.measurement_unit ?? ''})`)
    .join(', ')
}

function formatComplements(dish: Dish): string {
  if (dish.complements.length === 0) {
    return '—'
  }

  return dish.complements.map((complement) => complement.name).join(', ')
}

export function DishesTable({ dishes, onEdit, onToggleStatus }: DishesTableProps) {
  if (dishes.length === 0) {
    return <p className={styles.empty}>No se encontraron platillos con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Receta</th>
            <th>Complementos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish) => (
            <tr key={dish.id}>
              <td>{dish.name}</td>
              <td>{dish.category?.name ?? '—'}</td>
              <td>{dish.price.toFixed(2)}</td>
              <td className={styles.listCell}>{formatRecipe(dish)}</td>
              <td className={styles.listCell}>{formatComplements(dish)}</td>
              <td>
                <Badge tone={dish.is_active ? 'success' : 'neutral'}>
                  {dish.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className={styles.actions}>
                <Button type="button" size="sm" onClick={() => onEdit(dish)}>
                  Editar
                </Button>
                <Button type="button" size="sm" variant="primary" onClick={() => onToggleStatus(dish)}>
                  {dish.is_active ? 'Desactivar' : 'Activar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
