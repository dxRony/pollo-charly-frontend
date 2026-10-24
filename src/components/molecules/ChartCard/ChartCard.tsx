import { useState } from 'react'
import type { ReactNode } from 'react'
import styles from './ChartCard.module.css'

export interface ChartTable {
  columns: string[]
  rows: (string | number)[][]
}

interface ChartCardProps {
  title: string
  subtitle?: string
  /** Ocupa todo el ancho de la cuadrícula en pantallas anchas. */
  wide?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  /** Los mismos datos en forma de tabla, como alternativa accesible a la gráfica. */
  table?: ChartTable
  children: ReactNode
}

export function ChartCard({
  title,
  subtitle,
  wide = false,
  isEmpty = false,
  emptyMessage = 'No hay datos para mostrar en el periodo seleccionado.',
  table,
  children,
}: ChartCardProps) {
  const [showTable, setShowTable] = useState(false)
  const canShowTable = !isEmpty && table !== undefined

  return (
    <section className={[styles.card, wide ? styles.wide : ''].join(' ')} aria-label={title}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {canShowTable && (
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={showTable}
            onClick={() => setShowTable((current) => !current)}
          >
            {showTable ? 'Ver gráfica' : 'Ver tabla'}
          </button>
        )}
      </header>

      {isEmpty && <p className={styles.empty}>{emptyMessage}</p>}

      {!isEmpty && showTable && table && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isEmpty && !showTable && <div className={styles.body}>{children}</div>}
    </section>
  )
}
