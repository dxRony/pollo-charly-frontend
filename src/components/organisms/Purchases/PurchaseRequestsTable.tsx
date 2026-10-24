import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import {
  PURCHASE_REQUEST_STATUS_LABELS,
  type PurchaseRequest,
  type PurchaseRequestStatusName,
} from '@/types/purchase'
import styles from './PurchaseRequestsTable.module.css'

interface PurchaseRequestsTableProps {
  requests: PurchaseRequest[]
  onApproveClick: (request: PurchaseRequest) => void
  onRejectClick: (request: PurchaseRequest) => void
  onDetailClick: (request: PurchaseRequest) => void
}

function getRequestStatusTone(status: PurchaseRequestStatusName): 'success' | 'neutral' | 'warning' | 'accent' {
  switch (status) {
    case 'pendiente':
      return 'warning'
    case 'aprobada':
    case 'procesada':
      return 'success'
    case 'rechazada_sin_comprar':
      return 'neutral'
    default:
      return 'neutral'
  }
}

export function PurchaseRequestsTable({
  requests,
  onApproveClick,
  onRejectClick,
  onDetailClick,
}: PurchaseRequestsTableProps) {
  if (requests.length === 0) {
    return <div className={styles.empty}>No se encontraron solicitudes de compra registradas.</div>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th># Solicitud</th>
            <th>Fecha</th>
            <th>Solicitante / Origen</th>
            <th>Productos y Cantidades Sugeridas</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const isPending = req.status === 'pendiente'

            return (
              <tr key={req.id}>
                <td>
                  <strong>#{req.id}</strong>
                </td>
                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                <td>{req.requester_user_name ?? 'Sistema / Alerta'}</td>
                <td>
                  <div className={styles.itemsList}>
                    {req.items && req.items.length > 0 ? (
                      req.items.map((it) => (
                        <span key={it.id} className={styles.itemBadge}>
                          <strong>{it.supply_name ?? `Insumo #${it.supply_id}`}</strong>:{' '}
                          {it.suggested_quantity} {it.measurement_unit ?? 'uds'}
                          {it.approved_quantity !== null && (
                            <span style={{ color: '#16a34a' }}> (Aprobado: {it.approved_quantity})</span>
                          )}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Sin insumos</span>
                    )}
                  </div>
                </td>
                <td className={styles.reasonCell} title={req.reason ?? ''}>
                  {req.reason ?? '—'}
                </td>
                <td>
                  <Badge tone={getRequestStatusTone(req.status)}>
                    {PURCHASE_REQUEST_STATUS_LABELS[req.status] ?? req.status}
                  </Badge>
                </td>
                <td>
                  <div className={styles.actions}>
                    {isPending ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={() => onApproveClick(req)}
                        >
                          Revisar y Aprobar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="accent"
                          onClick={() => onRejectClick(req)}
                        >
                          Rechazar
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="accent"
                        onClick={() => onDetailClick(req)}
                      >
                        Ver Detalle
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
