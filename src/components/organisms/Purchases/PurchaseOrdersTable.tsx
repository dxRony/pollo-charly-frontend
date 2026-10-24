import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import {
  PURCHASE_ORDER_STATUS_LABELS,
  type PurchaseOrder,
  type PurchaseOrderStatusName,
} from '@/types/purchase'
import styles from './PurchaseRequestsTable.module.css'

interface PurchaseOrdersTableProps {
  orders: PurchaseOrder[]
  onReceiveClick: (order: PurchaseOrder) => void
  onReportIncidentClick: (order: PurchaseOrder) => void
  onDetailClick: (order: PurchaseOrder) => void
}

function getOrderStatusTone(status: PurchaseOrderStatusName): 'success' | 'neutral' | 'warning' | 'accent' {
  switch (status) {
    case 'solicitada':
      return 'warning'
    case 'recibida_completa':
      return 'success'
    case 'recibida_con_incidencia':
      return 'accent'
    case 'cancelada':
      return 'neutral'
    default:
      return 'neutral'
  }
}

export function PurchaseOrdersTable({
  orders,
  onReceiveClick,
  onReportIncidentClick,
  onDetailClick,
}: PurchaseOrdersTableProps) {
  if (orders.length === 0) {
    return <div className={styles.empty}>No se encontraron órdenes de compra registradas.</div>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha Emisión</th>
            <th>Proveedor</th>
            <th>Total ($)</th>
            <th>Estado</th>
            <th>Prevista / Recibida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isSolicitada = order.status === 'solicitada'
            const isRecibidaConIncidencia = order.status === 'recibida_con_incidencia'

            return (
              <tr key={order.id}>
                <td>
                  <strong>{order.code}</strong>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <strong>{order.supplier_name ?? `ID #${order.supplier_id}`}</strong>
                </td>
                <td>
                  <strong style={{ color: '#ea580c' }}>${order.total.toFixed(2)}</strong>
                </td>
                <td>
                  <Badge tone={getOrderStatusTone(order.status)}>
                    {PURCHASE_ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </Badge>
                </td>
                <td>
                  {order.received_date ? (
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>
                      Recibida: {order.received_date}
                    </span>
                  ) : order.expected_date ? (
                    <span>Prevista: {order.expected_date}</span>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>A convenir</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    {isSolicitada && (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={() => onReceiveClick(order)}
                        >
                          Confirmar Recepción
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="accent"
                          onClick={() => onReportIncidentClick(order)}
                        >
                          Reportar Incidencia
                        </Button>
                      </>
                    )}
                    {isRecibidaConIncidencia && (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => onReceiveClick(order)}
                      >
                        Revisar Entrega Corregida
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="accent"
                      onClick={() => onDetailClick(order)}
                    >
                      Detalle
                    </Button>
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
