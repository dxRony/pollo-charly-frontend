import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import type { Category } from '@/types/category'
import styles from './DishesFilterBar.module.css'

interface DishesFilterBarProps {
  search: string
  categoryId: number | ''
  isActive: string
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: number | '') => void
  onStatusChange: (value: string) => void
  onCreateClick: () => void
}

export function DishesFilterBar({
  search,
  categoryId,
  isActive,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onCreateClick,
}: DishesFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por nombre o descripción..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={categoryId}
        onChange={(event) =>
          onCategoryChange(event.target.value === '' ? '' : Number(event.target.value))
        }
        className={styles.filterSelect}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select
        value={isActive}
        onChange={(event) => onStatusChange(event.target.value)}
        className={styles.filterSelect}
      >
        <option value="">Todos los estados</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </Select>
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nuevo platillo
      </Button>
    </div>
  )
}
