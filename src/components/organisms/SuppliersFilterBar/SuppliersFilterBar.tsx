import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import type { DeliveryDay } from '@/types/supplier'
import styles from './SuppliersFilterBar.module.css'

interface SuppliersFilterBarProps {
  search: string
  isActive: string
  deliveryDayId: number | ''
  deliveryDays: DeliveryDay[]
  canManage: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onDeliveryDayChange: (value: number | '') => void
  onCreateClick: () => void
}

export function SuppliersFilterBar({
  search,
  isActive,
  deliveryDayId,
  deliveryDays,
  canManage,
  onSearchChange,
  onStatusChange,
  onDeliveryDayChange,
  onCreateClick,
}: SuppliersFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por empresa, contacto, teléfono..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={deliveryDayId}
        onChange={(event) =>
          onDeliveryDayChange(event.target.value === '' ? '' : Number(event.target.value))
        }
        className={styles.filterSelect}
      >
        <option value="">Todos los días de entrega</option>
        {deliveryDays.map((day) => (
          <option key={day.id} value={day.id}>
            {day.name}
          </option>
        ))}
      </Select>
      <Select
        value={isActive}
        onChange={(event) => onStatusChange(event.target.value)}
        className={styles.filterSelect}
      >
        <option value="">Todos los estados</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos (Baja lógica)</option>
      </Select>
      {canManage && (
        <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
          + Nuevo Proveedor
        </Button>
      )}
    </div>
  )
}
