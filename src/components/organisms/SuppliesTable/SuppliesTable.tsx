import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import type { Supply } from '@/types/supply'
import styles from './SuppliesTable.module.css'

interface SuppliesTableProps {
  supplies: Supply[]
  onEdit: (supply: Supply) => void
  onToggleStatus: (supply: Supply) => void
}

export function SuppliesTable({ supplies, onEdit, onToggleStatus }: SuppliesTableProps) {
  if (supplies.length === 0) {
    return <p className={styles.empty}>No se encontraron insumos con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Unidad</th>
            <th>Stock actual</th>
            <th>Stock mínimo</th>
            <th>Costo unitario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {supplies.map((supply) => (
            <tr key={supply.id}>
              <td>{supply.code}</td>
              <td>{supply.name}</td>
              <td>{supply.measurement_unit?.abbreviation ?? '—'}</td>
              <td className={styles.stockCell}>
                {supply.current_stock.toFixed(2)}
                {supply.is_low_stock && <Badge tone="warning">Bajo stock</Badge>}
              </td>
              <td>{supply.minimum_stock.toFixed(2)}</td>
              <td>{supply.unit_cost.toFixed(2)}</td>
              <td>
                <Badge tone={supply.is_active ? 'success' : 'neutral'}>
                  {supply.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className={styles.actions}>
                <Button type="button" size="sm" onClick={() => onEdit(supply)}>
                  Editar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => onToggleStatus(supply)}
                >
                  {supply.is_active ? 'Desactivar' : 'Activar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
