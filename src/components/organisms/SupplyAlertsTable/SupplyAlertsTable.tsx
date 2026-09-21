import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { ALERT_ORIGIN_LABELS, ALERT_STATUS_LABELS, type SupplyAlert } from '@/types/supplyAlert'
import styles from './SupplyAlertsTable.module.css'

interface SupplyAlertsTableProps {
  alerts: SupplyAlert[]
  onAttend: (alert: SupplyAlert) => void
}

export function SupplyAlertsTable({ alerts, onAttend }: SupplyAlertsTableProps) {
  if (alerts.length === 0) {
    return <p className={styles.empty}>No se encontraron alertas con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Insumo</th>
            <th>Origen</th>
            <th>Notas</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const isPending = alert.status_name === 'pending'

            return (
              <tr key={alert.id}>
                <td>{new Date(alert.created_at).toLocaleString()}</td>
                <td>{alert.supply?.name ?? '—'}</td>
                <td>{ALERT_ORIGIN_LABELS[alert.origin_name] ?? alert.origin_name}</td>
                <td className={styles.notesCell}>{alert.notes ?? '—'}</td>
                <td>{alert.user?.name ?? '—'}</td>
                <td>
                  <Badge tone={isPending ? 'warning' : 'success'}>
                    {ALERT_STATUS_LABELS[alert.status_name] ?? alert.status_name}
                  </Badge>
                </td>
                <td className={styles.actions}>
                  {isPending && (
                    <Button type="button" size="sm" variant="primary" onClick={() => onAttend(alert)}>
                      Atender
                    </Button>
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
