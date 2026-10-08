import { Modal } from '@/components/molecules/Modal'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import {
  PURCHASE_ORDER_STATUS_LABELS,
  type PurchaseOrder,
  type PurchaseOrderStatusName,
} from '@/types/purchase'
import styles from './ApproveRequestModal.module.css'

interface OrderDetailModalProps {
  order: PurchaseOrder
  onClose: () => void
}

function getStatusTone(status: PurchaseOrderStatusName): 'success' | 'neutral' | 'warning' | 'accent' {
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

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <Modal title={`Detalle de Orden: ${order.code}`} onClose={onClose}>
      <div className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '0.375rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Proveedor</span>
            <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{order.supplier_name ?? '—'}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Estado</span>
            <p style={{ margin: '0.25rem 0' }}>
              <Badge tone={getStatusTone(order.status)}>
                {PURCHASE_ORDER_STATUS_LABELS[order.status] ?? order.status}
              </Badge>
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Fecha Emisión</span>
            <p style={{ margin: '0.25rem 0' }}>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Fecha Prevista</span>
            <p style={{ margin: '0.25rem 0' }}>{order.expected_date ?? 'A convenir'}</p>
          </div>
          {order.received_date && (
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Fecha Recepción</span>
              <p style={{ margin: '0.25rem 0', color: '#16a34a', fontWeight: 600 }}>{order.received_date}</p>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <span className={styles.label}>Productos de la Orden</span>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cant. Pedida</th>
                  <th>Cant. Recibida</th>
                  <th>Precio Unit. ($)</th>
                  <th>Subtotal ($)</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.supply_name ?? `Insumo #${item.supply_id}`}</strong></td>
                    <td>{item.ordered_quantity} {item.measurement_unit ?? ''}</td>
                    <td>{item.received_quantity !== null ? `${item.received_quantity} ${item.measurement_unit ?? ''}` : 'Pendiente'}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {order.delivery_incidents && (order.delivery_incidents as Array<{ id: number; type?: string; status?: string; description?: string; receiving_user_name?: string; created_at?: string }>).length > 0 && (
          <div className={styles.section}>
            <span className={styles.label} style={{ color: '#b91c1c' }}>Incidencias Reportadas</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(order.delivery_incidents as Array<{ id: number; type?: string; status?: string; description?: string; receiving_user_name?: string; created_at?: string }>).map((inc) => (
                <div key={inc.id} style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.375rem', padding: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ color: '#991b1b', textTransform: 'capitalize' }}>
                      {inc.type ? inc.type.replace(/_/g, ' ') : 'Incidencia'}
                    </strong>
                    <Badge tone={inc.status === 'resuelta' ? 'success' : 'accent'}>
                      {inc.status ?? 'reportada'}
                    </Badge>
                  </div>
                  <p style={{ margin: '0.25rem 0', color: '#374151' }}>{inc.description}</p>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Reportada por: {inc.receiving_user_name ?? 'Mesero/Cajero'} • {inc.created_at ? new Date(inc.created_at).toLocaleString() : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.totalRow}>
          <span>Total de la Orden:</span>
          <span className={styles.totalAmount}>${order.total.toFixed(2)}</span>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
