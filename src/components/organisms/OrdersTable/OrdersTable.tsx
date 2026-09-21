import { Badge } from '@/components/atoms/Badge'
import { ORDER_STATUS_LABELS, ORDER_TYPE_OPTIONS, type Order } from '@/types/order'
import styles from './OrdersTable.module.css'

interface OrdersTableProps {
  orders: Order[]
}

function statusTone(statusName: string): 'success' | 'neutral' | 'warning' {
  if (statusName === 'lista' || statusName === 'entregada') {
    return 'success'
  }
  if (statusName === 'cancelada') {
    return 'neutral'
  }
  return 'warning'
}

function formatOrderType(typeName: string): string {
  return ORDER_TYPE_OPTIONS.find((option) => option.value === typeName)?.label ?? typeName
}

function formatItems(order: Order): string {
  if (order.items.length === 0) {
    return '—'
  }
  return order.items.map((item) => `${item.quantity}x ${item.dish?.name ?? '—'}`).join(', ')
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return <p className={styles.empty}>No se encontraron comandas con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Mesa</th>
            <th>Mesero</th>
            <th>Platillos</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.code}</td>
              <td>{formatOrderType(order.order_type)}</td>
              <td>{order.table ? `Mesa ${order.table.number}` : '—'}</td>
              <td>{order.waiter?.name ?? '—'}</td>
              <td className={styles.itemsCell}>{formatItems(order)}</td>
              <td>{order.total.toFixed(2)}</td>
              <td>
                <Badge tone={statusTone(order.order_status)}>
                  {ORDER_STATUS_LABELS[order.order_status] ?? order.order_status}
                </Badge>
              </td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
