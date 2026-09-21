import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import { ACTIVE_ORDER_STATUSES, ORDER_TYPE_OPTIONS } from '@/types/order'
import type { OrderTypeAlias } from '@/types/order'
import styles from './OrdersFilterBar.module.css'

interface OrdersFilterBarProps {
  search: string
  orderType: OrderTypeAlias | ''
  status: string
  onSearchChange: (value: string) => void
  onOrderTypeChange: (value: OrderTypeAlias | '') => void
  onStatusChange: (value: string) => void
  onCreateClick: () => void
}

export function OrdersFilterBar({
  search,
  orderType,
  status,
  onSearchChange,
  onOrderTypeChange,
  onStatusChange,
  onCreateClick,
}: OrdersFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por código o notas..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={orderType}
        onChange={(event) => onOrderTypeChange(event.target.value as OrderTypeAlias | '')}
        className={styles.filterSelect}
      >
        <option value="">Todos los tipos</option>
        {ORDER_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className={styles.filterSelect}
      >
        <option value={ACTIVE_ORDER_STATUSES}>Activas</option>
        <option value="pendiente">Pendiente</option>
        <option value="en_preparacion">En preparación</option>
        <option value="lista">Lista</option>
        <option value="entregada">Entregada</option>
        <option value="cancelada">Cancelada</option>
        <option value="">Todas</option>
      </Select>
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nueva comanda
      </Button>
    </div>
  )
}
