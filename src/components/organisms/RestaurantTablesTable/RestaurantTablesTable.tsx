import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { TABLE_STATUS_LABELS, type RestaurantTable } from '@/types/restaurantTable'
import styles from './RestaurantTablesTable.module.css'

interface RestaurantTablesTableProps {
  tables: RestaurantTable[]
  onEdit: (table: RestaurantTable) => void
  onToggleStatus: (table: RestaurantTable) => void
}

function statusTone(statusName: string): 'success' | 'neutral' | 'warning' {
  if (statusName === 'disponible') {
    return 'success'
  }
  if (statusName === 'inactiva') {
    return 'neutral'
  }
  return 'warning'
}

export function RestaurantTablesTable({ tables, onEdit, onToggleStatus }: RestaurantTablesTableProps) {
  if (tables.length === 0) {
    return <p className={styles.empty}>No se encontraron mesas con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Número</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => {
            const isInactive = table.status_name === 'inactiva'

            return (
              <tr key={table.id}>
                <td>Mesa {table.number}</td>
                <td>{table.capacity}</td>
                <td>
                  <Badge tone={statusTone(table.status_name)}>
                    {TABLE_STATUS_LABELS[table.status_name] ?? table.status_name}
                  </Badge>
                </td>
                <td className={styles.actions}>
                  <Button type="button" size="sm" onClick={() => onEdit(table)}>
                    Editar
                  </Button>
                  <Button type="button" size="sm" variant="primary" onClick={() => onToggleStatus(table)}>
                    {isInactive ? 'Activar' : 'Desactivar'}
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
