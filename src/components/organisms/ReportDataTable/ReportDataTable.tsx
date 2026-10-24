import { useState } from 'react'
import { PaginationControls } from '@/components/molecules/PaginationControls'
import styles from './ReportDataTable.module.css'

interface ReportDataTableProps {
  columns: string[]
  rows: Array<Array<string | number | null>>
  emptyMessage?: string
}

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export function ReportDataTable({ columns, rows, emptyMessage }: ReportDataTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  // Al cambiar los datos (por ejemplo, al aplicar otros filtros) se vuelve a la primera página.
  const dataSignature = `${rows.length}|${rows[0]?.join('|') ?? ''}|${rows[rows.length - 1]?.join('|') ?? ''}`
  const [lastSignature, setLastSignature] = useState(dataSignature)

  if (dataSignature !== lastSignature) {
    setLastSignature(dataSignature)
    setPage(1)
  }

  if (rows.length === 0) {
    return (
      <p className={styles.empty}>{emptyMessage ?? 'No se encontraron datos con los filtros seleccionados.'}</p>
    )
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handlePageSizeChange(nextSize: number) {
    setPageSize(nextSize)
    setPage(1)
  }

  return (
    <div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIndex) => (
              <tr key={(currentPage - 1) * pageSize + rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > PAGE_SIZE_OPTIONS[0] && (
        <PaginationControls
          page={currentPage}
          pageSize={pageSize}
          totalItems={rows.length}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
