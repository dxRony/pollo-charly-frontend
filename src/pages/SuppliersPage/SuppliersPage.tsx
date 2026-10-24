import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { RecordDeliveryModal } from '@/components/organisms/RecordDeliveryModal'
import { SupplierDetailModal } from '@/components/organisms/SupplierDetailModal'
import { SupplierFormModal } from '@/components/organisms/SupplierFormModal'
import { SuppliersFilterBar } from '@/components/organisms/SuppliersFilterBar'
import { SuppliersTable } from '@/components/organisms/SuppliersTable'
import { useAuth } from '@/hooks/useAuth'
import { useDeliveryCatalogs } from '@/hooks/useDeliveryCatalogs'
import { useSuppliers } from '@/hooks/useSuppliers'
import * as supplierService from '@/services/supplierService'
import type {
  CreateSupplierPayload,
  Supplier,
  UpdateSupplierPayload,
} from '@/types/supplier'
import styles from './SuppliersPage.module.css'

type FormModalState = { mode: 'create' } | { mode: 'edit'; supplier: Supplier } | null

export function SuppliersPage() {
  const { user } = useAuth()
  const canManage = user?.role?.name === 'Administrador'

  const {
    suppliers,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    setPage,
    refetch,
  } = useSuppliers()

  const { deliveryDays } = useDeliveryCatalogs()

  const [formModalState, setFormModalState] = useState<FormModalState>(null)
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null)
  const [deliverySupplier, setDeliverySupplier] = useState<Supplier | null>(null)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  function showNotification(msg: string) {
    setSuccessBanner(msg)
    setTimeout(() => {
      setSuccessBanner(null)
    }, 5000)
  }

  async function handleFormSubmit(payload: CreateSupplierPayload | UpdateSupplierPayload) {
    if (formModalState?.mode === 'edit') {
      const res = await supplierService.updateSupplier(formModalState.supplier.id, payload as UpdateSupplierPayload)
      showNotification(res.message || 'Proveedor actualizado exitosamente.')
    } else {
      const res = await supplierService.createSupplier(payload as CreateSupplierPayload)
      showNotification(res.message || 'Proveedor registrado exitosamente.')
    }
    setFormModalState(null)
    await refetch()
  }

  async function handleToggleStatus(supplier: Supplier) {
    try {
      const res = await supplierService.toggleSupplierStatus(supplier.id)
      showNotification(res.message)
      await refetch()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al cambiar estado del proveedor.')
    }
  }

  function handleRecordDeliverySuccess(msg: string) {
    showNotification(msg)
    refetch()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Proveedores</h1>
          <p className={styles.subtitle}>
            Administra contactos, productos, precios acordados y consulta el historial de entregas e incidencias.
          </p>
        </div>
      </div>

      {successBanner && (
        <div className={styles.successBanner}>
          <span>✓ {successBanner}</span>
          <button type="button" onClick={() => setSuccessBanner(null)} className={styles.closeBannerBtn}>
            ✕
          </button>
        </div>
      )}

      <SuppliersFilterBar
        search={filters.search ?? ''}
        isActive={filters.is_active === undefined ? '' : String(filters.is_active)}
        deliveryDayId={filters.delivery_day_id ?? ''}
        deliveryDays={deliveryDays}
        canManage={canManage}
        onSearchChange={(value) => updateFilters({ search: value || undefined })}
        onStatusChange={(value) =>
          updateFilters({ is_active: value === '' ? undefined : value === 'true' })
        }
        onDeliveryDayChange={(value) =>
          updateFilters({ delivery_day_id: value === '' ? undefined : value })
        }
        onCreateClick={() => setFormModalState({ mode: 'create' })}
      />

      {error && <p className={styles.error}>{error}</p>}

      {isLoading ? (
        <p className={styles.loading}>Cargando proveedores...</p>
      ) : (
        <SuppliersTable
          suppliers={suppliers}
          canManage={canManage}
          onViewDetail={(supplier) => setDetailSupplier(supplier)}
          onRecordDelivery={(supplier) => setDeliverySupplier(supplier)}
          onEdit={(supplier) => setFormModalState({ mode: 'edit', supplier })}
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

      {/* Modal de Crear / Editar Proveedor */}
      {formModalState && (
        <SupplierFormModal
          initialData={formModalState.mode === 'edit' ? formModalState.supplier : null}
          onClose={() => setFormModalState(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Modal de Detalle e Historial */}
      {detailSupplier && (
        <SupplierDetailModal
          supplierId={detailSupplier.id}
          onClose={() => setDetailSupplier(null)}
          onRecordDeliveryClick={() => {
            const current = detailSupplier
            setDetailSupplier(null)
            setDeliverySupplier(current)
          }}
        />
      )}

      {/* Modal de Recepción de Entrega (con o sin Incidencia) */}
      {deliverySupplier && (
        <RecordDeliveryModal
          supplier={deliverySupplier}
          onClose={() => setDeliverySupplier(null)}
          onSuccess={handleRecordDeliverySuccess}
        />
      )}
    </div>
  )
}
