import { Button } from '@/components/atoms/Button'
import { TextInput } from '@/components/atoms/TextInput'
import { Select } from '@/components/atoms/Select'
import type { SupplyAlertOriginAlias, SupplyAlertStatusAlias } from '@/types/supplyAlert'
import type { Supply } from '@/types/supply'
import styles from './SupplyAlertsFilterBar.module.css'

interface SupplyAlertsFilterBarProps {
  search: string
  supplyId: number | ''
  origin: SupplyAlertOriginAlias | ''
  status: SupplyAlertStatusAlias | ''
  supplies: Supply[]
  onSearchChange: (value: string) => void
  onSupplyChange: (value: number | '') => void
  onOriginChange: (value: SupplyAlertOriginAlias | '') => void
  onStatusChange: (value: SupplyAlertStatusAlias | '') => void
  onCreateClick: () => void
}

export function SupplyAlertsFilterBar({
  search,
  supplyId,
  origin,
  status,
  supplies,
  onSearchChange,
  onSupplyChange,
  onOriginChange,
  onStatusChange,
  onCreateClick,
}: SupplyAlertsFilterBarProps) {
  return (
    <div className={styles.bar}>
      <TextInput
        placeholder="Buscar por insumo o notas..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.search}
      />
      <Select
        value={supplyId}
        onChange={(event) => onSupplyChange(event.target.value === '' ? '' : Number(event.target.value))}
        className={styles.filterSelect}
      >
        <option value="">Todos los insumos</option>
        {supplies.map((supply) => (
          <option key={supply.id} value={supply.id}>
            {supply.name}
          </option>
        ))}
      </Select>
      <Select
        value={origin}
        onChange={(event) => onOriginChange(event.target.value as SupplyAlertOriginAlias | '')}
        className={styles.filterSelect}
      >
        <option value="">Todos los orígenes</option>
        <option value="manual">Manual</option>
        <option value="automatic">Automática</option>
      </Select>
      <Select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as SupplyAlertStatusAlias | '')}
        className={styles.filterSelect}
      >
        <option value="pending">Pendientes</option>
        <option value="attended">Atendidas</option>
        <option value="">Todas</option>
      </Select>
      <Button type="button" variant="primary" onClick={onCreateClick} className={styles.createButton}>
        + Nueva alerta
      </Button>
    </div>
  )
}
