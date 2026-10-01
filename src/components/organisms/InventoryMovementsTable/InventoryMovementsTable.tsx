import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import {
  ADJUSTMENT_STATUS_LABELS,
  MOVEMENT_TYPE_LABELS,
  type InventoryMovement,
} from '@/types/inventoryMovement'
import styles from './InventoryMovementsTable.module.css'

interface InventoryMovementsTableProps {
  movements: InventoryMovement[]
  onApprove: (movement: InventoryMovement) => void
  onReject: (movement: InventoryMovement) => void
}

function statusTone(statusName: string): 'success' | 'neutral' | 'warning' {
  if (statusName === 'aprobado') {
    return 'success'
  }
  if (statusName === 'pendiente_aprobacion') {
    return 'warning'
  }
  return 'neutral'
}

export function InventoryMovementsTable({ movements, onApprove, onReject }: InventoryMovementsTableProps) {
  if (movements.length === 0) {
    return <p className={styles.empty}>No se encontraron movimientos con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Insumo</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Stock</th>
            <th>Usuario</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => {
            const statusName = movement.adjustment_status?.name ?? null
            const isPendingAdjustment = statusName === 'pendiente_aprobacion'

            return (
              <tr key={movement.id}>
                <td>{new Date(movement.created_at).toLocaleString()}</td>
                <td>{movement.supply?.name ?? '—'}</td>
                <td>{MOVEMENT_TYPE_LABELS[movement.type] ?? movement.type}</td>
                <td>{movement.quantity.toFixed(2)}</td>
                <td>
                  {movement.previous_stock.toFixed(2)} → {movement.new_stock.toFixed(2)}
                </td>
                <td>{movement.user?.name ?? '—'}</td>
                <td className={styles.reasonCell}>{movement.reason ?? '—'}</td>
                <td>
                  {statusName ? (
                    <Badge tone={statusTone(statusName)}>
                      {ADJUSTMENT_STATUS_LABELS[statusName] ?? statusName}
                    </Badge>
                  ) : (
                    '—'
                  )}
                </td>
                <td className={styles.actions}>
                  {isPendingAdjustment && (
                    <>
                      <Button type="button" size="sm" variant="primary" onClick={() => onApprove(movement)}>
                        Aprobar
                      </Button>
                      <Button type="button" size="sm" onClick={() => onReject(movement)}>
                        Rechazar
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
