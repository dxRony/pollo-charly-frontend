import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { ORDER_STATUS_LABELS, ORDER_TYPE_OPTIONS } from '@/types/order'
import type { KitchenOrderStatusTarget, Order } from '@/types/order'
import styles from './KitchenOrderCard.module.css'

interface KitchenOrderCardProps {
  order: Order
  onAdvance: (order: Order, nextStatus: KitchenOrderStatusTarget) => void
  isAdvancing: boolean
}

const NEXT_STATUS_LABEL: Record<KitchenOrderStatusTarget, string> = {
  en_preparacion: 'Iniciar preparación',
  lista: 'Marcar como lista',
}

function nextStatusFor(order: Order): KitchenOrderStatusTarget | null {
  if (order.order_status === 'pendiente') {
    return 'en_preparacion'
  }
  if (order.order_status === 'en_preparacion') {
    return 'lista'
  }
  return null
}

function formatOrderType(typeName: string): string {
  return ORDER_TYPE_OPTIONS.find((option) => option.value === typeName)?.label ?? typeName
}

export function KitchenOrderCard({ order, onAdvance, isAdvancing }: KitchenOrderCardProps) {
  const nextStatus = nextStatusFor(order)
  const activeItems = order.items.filter(
    (item) => item.status_name !== 'eliminado' && item.status_name !== 'cancelado',
  )

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.code}>{order.code}</span>
        <Badge tone={order.order_status === 'en_preparacion' ? 'warning' : 'neutral'}>
          {ORDER_STATUS_LABELS[order.order_status] ?? order.order_status}
        </Badge>
      </div>
      <p className={styles.meta}>
        {formatOrderType(order.order_type)}
        {order.table ? ` · Mesa ${order.table.number}` : ''}
        {' · '}
        {new Date(order.created_at).toLocaleTimeString()}
      </p>
      <ul className={styles.items}>
        {activeItems.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.itemLine}>
              {item.quantity}x {item.dish?.name ?? '—'}
            </span>
            {item.notes && <span className={styles.itemNote}>"{item.notes}"</span>}
            {item.complements.length > 0 && (
              <ul className={styles.complements}>
                {item.complements.map((complementLine) => (
                  <li key={complementLine.id}>
                    + {complementLine.quantity}x {complementLine.complement?.name ?? '—'}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {order.notes && <p className={styles.notes}>Obs: {order.notes}</p>}
      {nextStatus && (
        <Button
          type="button"
          variant="primary"
          onClick={() => onAdvance(order, nextStatus)}
          disabled={isAdvancing}
        >
          {isAdvancing ? 'Actualizando...' : NEXT_STATUS_LABEL[nextStatus]}
        </Button>
      )}
    </div>
  )
}
