import { TextInput } from '@/components/atoms/TextInput'
import { CategoryFilterChips, type CategoryFilterOption } from '@/components/molecules/CategoryFilterChips'
import styles from './DailyMenuFilters.module.css'

interface DailyMenuFiltersProps {
  search: string
  categoryOptions: CategoryFilterOption[]
  selectedCategoryId: number | null
  onlySelected: boolean
  selectedCount: number
  onSearchChange: (value: string) => void
  onCategoryChange: (id: number | null) => void
  onOnlySelectedChange: (value: boolean) => void
}

export function DailyMenuFilters({
  search,
  categoryOptions,
  selectedCategoryId,
  onlySelected,
  selectedCount,
  onSearchChange,
  onCategoryChange,
  onOnlySelectedChange,
}: DailyMenuFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <TextInput
          type="search"
          className={styles.search}
          placeholder="Buscar por nombre o descripción..."
          aria-label="Buscar platillos"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <label className={styles.onlySelected}>
          <input
            type="checkbox"
            checked={onlySelected}
            onChange={(event) => onOnlySelectedChange(event.target.checked)}
          />
          Solo seleccionados ({selectedCount})
        </label>
      </div>
      {categoryOptions.length > 2 && (
        <CategoryFilterChips
          label="Filtrar platillos por categoría"
          options={categoryOptions}
          selectedId={selectedCategoryId}
          onChange={onCategoryChange}
        />
      )}
    </div>
  )
}
