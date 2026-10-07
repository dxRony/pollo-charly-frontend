import styles from './CategoryFilterChips.module.css'

export interface CategoryFilterOption {
  id: number | null
  label: string
  count: number
}

interface CategoryFilterChipsProps {
  label: string
  options: CategoryFilterOption[]
  selectedId: number | null
  onChange: (id: number | null) => void
}

export function CategoryFilterChips({ label, options, selectedId, onChange }: CategoryFilterChipsProps) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.id === selectedId

        return (
          <button
            key={option.id ?? 'all'}
            type="button"
            className={[styles.chip, isActive ? styles.active : ''].filter(Boolean).join(' ')}
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
          >
            {option.label}
            <span className={styles.count}>{option.count}</span>
          </button>
        )
      })}
    </div>
  )
}
