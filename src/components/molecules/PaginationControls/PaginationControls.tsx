import { useId } from 'react'
import { Select } from '@/components/atoms/Select'
import styles from './PaginationControls.module.css'

interface PaginationControlsProps {
  page: number
  pageSize: number
  totalItems: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

type PageItem = number | 'gap-before' | 'gap-after'

/**
 * Páginas visibles: siempre la primera y la última, con "…" donde se omiten. Cerca de los extremos se muestran cuatro
 * páginas seguidas; en el medio, la actual y sus vecinas.
 */
function buildPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'gap-after', total]
  }

  if (current >= total - 3) {
    return [1, 'gap-before', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, 'gap-before', current - 1, current, current + 1, 'gap-after', total]
}

export function PaginationControls({
  page,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  const selectId = useId()
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize))
  const firstItem = (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalItems)

  return (
    <nav className={styles.controls} aria-label="Paginación de la tabla">
      <p className={styles.summary} aria-live="polite">
        Mostrando <strong>{firstItem}–{lastItem}</strong> de <strong>{totalItems}</strong>
      </p>

      <div className={styles.pages}>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          ‹
        </button>

        {buildPageItems(page, pageCount).map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              className={[styles.pageButton, item === page ? styles.current : ''].filter(Boolean).join(' ')}
              onClick={() => onPageChange(item)}
              aria-label={`Página ${item}`}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          ) : (
            <span key={item} className={styles.gap} aria-hidden="true">
              …
            </span>
          ),
        )}

        <button
          type="button"
          className={styles.pageButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </div>

      <div className={styles.pageSize}>
        <label htmlFor={selectId} className={styles.pageSizeLabel}>
          Filas por página
        </label>
        <Select
          id={selectId}
          className={styles.select}
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
    </nav>
  )
}
