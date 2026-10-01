import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import type { Complement } from '@/types/complement'
import styles from './ComplementsTable.module.css'

interface ComplementsTableProps {
  complements: Complement[]
  onEdit: (complement: Complement) => void
  onToggleStatus: (complement: Complement) => void
}

function formatSupplies(complement: Complement): string {
  if (complement.supplies.length === 0) {
    return '—'
  }

  return complement.supplies
    .map((line) => `${line.supply_name ?? '—'} (${line.required_quantity} ${line.measurement_unit ?? ''})`)
    .join(', ')
}

export function ComplementsTable({ complements, onEdit, onToggleStatus }: ComplementsTableProps) {
  if (complements.length === 0) {
    return <p className={styles.empty}>No se encontraron complementos con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio extra</th>
            <th>Insumos asociados</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {complements.map((complement) => (
            <tr key={complement.id}>
              <td>{complement.name}</td>
              <td>{complement.description ?? '—'}</td>
              <td>{complement.extra_price.toFixed(2)}</td>
              <td className={styles.suppliesCell}>{formatSupplies(complement)}</td>
              <td>
                <Badge tone={complement.is_active ? 'success' : 'neutral'}>
                  {complement.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className={styles.actions}>
                <Button type="button" size="sm" onClick={() => onEdit(complement)}>
                  Editar
                </Button>
                <Button type="button" size="sm" variant="primary" onClick={() => onToggleStatus(complement)}>
                  {complement.is_active ? 'Desactivar' : 'Activar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
