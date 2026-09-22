import styles from './ReportDataTable.module.css'

interface ReportDataTableProps {
  columns: string[]
  rows: Array<Array<string | number | null>>
  emptyMessage?: string
}

export function ReportDataTable({ columns, rows, emptyMessage }: ReportDataTableProps) {
  if (rows.length === 0) {
    return (
      <p className={styles.empty}>{emptyMessage ?? 'No se encontraron datos con los filtros seleccionados.'}</p>
    )
  }

  return (
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
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
