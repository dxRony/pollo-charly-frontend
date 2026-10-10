import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { ALERT_ORIGIN_LABELS, ALERT_STATUS_LABELS, type SupplyAlert } from '@/types/supplyAlert'
import styles from './SupplyAlertsTable.module.css'

interface SupplyAlertsTableProps {
  alerts: SupplyAlert[]
  onAttend: (alert: SupplyAlert) => void
  onReviewAdjustment?: (alert: SupplyAlert) => void
}

export function SupplyAlertsTable({
  alerts,
  onAttend,
  onReviewAdjustment,
}: SupplyAlertsTableProps) {
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
            <th>Motivo / Notas</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => {
            const isPending = alert.status_name === 'pending'
            const isAdjustmentAlert = Boolean(
              alert.inventory_movement_id ||
              alert.inventory_movement ||
              (alert.origin_name === 'manual' && alert.notes?.toLowerCase().includes('ajuste')) ||
              alert.notes?.toLowerCase().includes('solicitud de ajuste')
            )
            const movementStatus = alert.inventory_movement?.adjustment_status?.name

            const originLabel = isAdjustmentAlert
              ? 'Ajuste manual'
              : (ALERT_ORIGIN_LABELS[alert.origin_name] ?? alert.origin_name)

            return (
              <tr key={alert.id}>
                <td>{new Date(alert.created_at).toLocaleString()}</td>
                <td>
                  <strong>{alert.supply?.name ?? '—'}</strong>
                  {alert.supply?.code && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {alert.supply.code}
                    </div>
                  )}
                </td>
                <td>{originLabel}</td>
                <td className={styles.notesCell}>{alert.notes ?? '—'}</td>
                <td>
                  <div>{alert.user?.name ?? '—'}</div>
                  {alert.user?.role && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      ({alert.user.role})
                    </div>
                  )}
                </td>
                <td>
                  {isAdjustmentAlert && movementStatus && !isPending ? (
                    <Badge tone={movementStatus === 'aprobado' ? 'success' : 'neutral'}>
                      {movementStatus === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                    </Badge>
                  ) : (
                    <Badge tone={isPending ? 'warning' : 'success'}>
                      {ALERT_STATUS_LABELS[alert.status_name] ?? alert.status_name}
                    </Badge>
                  )}
                </td>
                <td className={styles.actions}>
                  {isAdjustmentAlert ? (
                    isPending ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => onReviewAdjustment?.(alert)}
                      >
                        Revisar solicitud
                      </Button>
                    ) : onReviewAdjustment ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onReviewAdjustment(alert)}
                      >
                        Ver detalle
                      </Button>
                    ) : (
                      '—'
                    )
                  ) : isPending ? (
                    <Button type="button" size="sm" variant="primary" onClick={() => onAttend(alert)}>
                      Atender
                    </Button>
                  ) : (
                    '—'
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
