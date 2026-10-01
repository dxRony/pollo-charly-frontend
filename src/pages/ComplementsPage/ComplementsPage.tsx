import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { ComplementsFilterBar } from '@/components/organisms/ComplementsFilterBar'
import { ComplementsTable } from '@/components/organisms/ComplementsTable'
import { ComplementFormModal } from '@/components/organisms/ComplementFormModal'
import { useComplements } from '@/hooks/useComplements'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import * as complementService from '@/services/complementService'
import type { Complement, CreateComplementPayload, UpdateComplementPayload } from '@/types/complement'
import styles from './ComplementsPage.module.css'

type ModalState = { mode: 'create' } | { mode: 'edit'; complement: Complement } | null

export function ComplementsPage() {
  const { complements, pagination, filters, isLoading, error, updateFilters, setPage, refetch } =
    useComplements()
  const { supplies } = useActiveSupplies()
  const [modalState, setModalState] = useState<ModalState>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleFormSubmit(payload: CreateComplementPayload | UpdateComplementPayload) {
    if (modalState?.mode === 'edit') {
      await complementService.updateComplement(modalState.complement.id, payload as UpdateComplementPayload)
    } else {
      await complementService.createComplement(payload as CreateComplementPayload)
    }
    setModalState(null)
    await refetch()
  }

  async function handleToggleStatus(complement: Complement) {
    setActionError(null)
    try {
      await complementService.toggleComplementStatus(complement.id, !complement.is_active)
      await refetch()
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'No se pudo cambiar el estado del complemento.',
      )
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Gestión de complementos</h1>

      <ComplementsFilterBar
        search={filters.search ?? ''}
        isActive={filters.is_active === undefined ? '' : String(filters.is_active)}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onStatusChange={(value) =>
          updateFilters({ is_active: value === '' ? undefined : value === 'true' })
        }
        onCreateClick={() => setModalState({ mode: 'create' })}
      />

      {error && <p className={styles.error}>{error}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando complementos...</p>
      ) : (
        <ComplementsTable
          complements={complements}
          onEdit={(complement) => setModalState({ mode: 'edit', complement })}
          onToggleStatus={handleToggleStatus}
        />
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

      {modalState && (
        <ComplementFormModal
          mode={modalState.mode}
          availableSupplies={supplies}
          initialComplement={modalState.mode === 'edit' ? modalState.complement : undefined}
          onClose={() => setModalState(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}
