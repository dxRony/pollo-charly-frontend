import type { ReactNode } from 'react'
import styles from './ChartGrid.module.css'

interface ChartGridProps {
  children: ReactNode
}

export function ChartGrid({ children }: ChartGridProps) {
  return <div className={styles.grid}>{children}</div>
}
