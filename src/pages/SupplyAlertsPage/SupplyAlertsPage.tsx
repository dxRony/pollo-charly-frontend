import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { SupplyAlertsFilterBar } from '@/components/organisms/SupplyAlertsFilterBar'
import { SupplyAlertsTable } from '@/components/organisms/SupplyAlertsTable'
import { SupplyAlertFormModal } from '@/components/organisms/SupplyAlertFormModal'
import { useSupplyAlerts } from '@/hooks/useSupplyAlerts'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import * as supplyAlertService from '@/services/supplyAlertService'
import { ApiError } from '@/services/api'
import type { CreateSupplyAlertPayload, SupplyAlert } from '@/types/supplyAlert'
import styles from './SupplyAlertsPage.module.css'

export function SupplyAlertsPage() {
  const { alerts, pagination, filters, isLoading, error, updateFilters, setPage, refetch } =
    useSupplyAlerts()
  const { supplies } = useActiveSupplies()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleFormSubmit(payload: CreateSupplyAlertPayload) {
    await supplyAlertService.createSupplyAlert(payload)
    setIsModalOpen(false)
    await refetch()
  }

  async function handleAttend(alert: SupplyAlert) {
    setActionError(null)
    try {
      await supplyAlertService.attendSupplyAlert(alert.id)
      await refetch()
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setActionError(Object.values(err.errors).flat().join(' '))
      } else {
        setActionError(err instanceof Error ? err.message : 'No se pudo atender la alerta.')
      }
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Alertas de reposición</h1>

      <SupplyAlertsFilterBar
        search={filters.search ?? ''}
        supplyId={filters.supply_id ?? ''}
        origin={filters.origin ?? ''}
        status={filters.status ?? ''}
        supplies={supplies}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onSupplyChange={(value) => updateFilters({ supply_id: value === '' ? undefined : value })}
        onOriginChange={(value) => updateFilters({ origin: value === '' ? undefined : value })}
        onStatusChange={(value) => updateFilters({ status: value === '' ? undefined : value })}
        onCreateClick={() => setIsModalOpen(true)}
      />

      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando alertas...</p>
      ) : (
        <SupplyAlertsTable alerts={alerts} onAttend={handleAttend} />
      )}

      {pagination && pagination.lastPage > 1 && (
        <div className={styles.pagination}>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage <= 1}
            onClick={() => setPage(pagination.currentPage - 1)}
          >
            Anterior
          </Button>
          <span className={styles.pageInfo}>
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>
          <Button
            type="button"
            size="sm"
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => setPage(pagination.currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {isModalOpen && (
        <SupplyAlertFormModal
          availableSupplies={supplies}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
