import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import {
  ApproveRequestModal,
  ConfirmReceiveModal,
  CreateRequestModal,
  ManualPurchaseModal,
  OrderDetailModal,
  PurchaseOrdersTable,
  PurchaseRequestsTable,
  RejectRequestModal,
  ReportIncidentModal,
} from '@/components/organisms/Purchases'
import { useAuth } from '@/hooks/useAuth'
import { useActiveSuppliers } from '@/hooks/useActiveSuppliers'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders'
import { usePurchaseRequests } from '@/hooks/usePurchaseRequests'
import * as purchaseService from '@/services/purchaseService'
import type {
  ApprovePurchaseRequestPayload,
  CreatePurchaseOrderPayload,
  CreatePurchaseRequestPayload,
  PurchaseOrder,
  PurchaseRequest,
  ReceivePurchaseOrderPayload,
  RejectPurchaseRequestPayload,
  ReportOrderIncidentPayload,
} from '@/types/purchase'
import styles from './PurchasesPage.module.css'

export function PurchasesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role?.name === 'Administrador'

  const [activeTab, setActiveTab] = useState<'requests' | 'orders'>(isAdmin ? 'requests' : 'orders')
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Catalogs
  const { suppliers } = useActiveSuppliers()
  const { supplies } = useActiveSupplies()

  // Requests state (only fetched if admin)
  const {
    requests,
    pagination: reqPagination,
    filters: reqFilters,
    isLoading: reqLoading,
    error: reqError,
    updateFilters: updateReqFilters,
    setPage: setReqPage,
    refetch: refetchRequests,
  } = usePurchaseRequests({}, isAdmin)

  // Orders state
  const {
    orders,
    pagination: ordPagination,
    filters: ordFilters,
    isLoading: ordLoading,
    error: ordError,
    updateFilters: updateOrdFilters,
    setPage: setOrdPage,
    refetch: refetchOrders,
  } = usePurchaseOrders()

  // Modals state
  const [requestToApprove, setRequestToApprove] = useState<PurchaseRequest | null>(null)
  const [requestToReject, setRequestToReject] = useState<PurchaseRequest | null>(null)
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false)
  const [isManualPurchaseOpen, setIsManualPurchaseOpen] = useState(false)
  const [orderToReceive, setOrderToReceive] = useState<PurchaseOrder | null>(null)
  const [orderToReportIncident, setOrderToReportIncident] = useState<PurchaseOrder | null>(null)
  const [orderDetail, setOrderDetail] = useState<PurchaseOrder | null>(null)

  const pendingRequestsCount = requests.filter((r) => r.status === 'pendiente').length

  function showFeedback(msg: string) {
    setFeedbackMessage(msg)
    setActionError(null)
    setTimeout(() => setFeedbackMessage(null), 6000)
  }

  // Action handlers
  async function handleApproveRequest(payload: ApprovePurchaseRequestPayload) {
    if (!requestToApprove) return
    const res = await purchaseService.approvePurchaseRequest(requestToApprove.id, payload)
    showFeedback(res.message)
    await refetchRequests()
    await refetchOrders()
  }

  async function handleRejectRequest(payload: RejectPurchaseRequestPayload) {
    if (!requestToReject) return
    const res = await purchaseService.rejectPurchaseRequest(requestToReject.id, payload)
    showFeedback(res.message)
    await refetchRequests()
  }

  async function handleCreateRequest(payload: CreatePurchaseRequestPayload) {
    const res = await purchaseService.createPurchaseRequest(payload)
    showFeedback(res.message)
    await refetchRequests()
  }

  async function handleCreateManualPurchase(payload: CreatePurchaseOrderPayload) {
    const res = await purchaseService.createPurchaseOrder(payload)
    showFeedback(res.message)
    await refetchOrders()
    setActiveTab('orders')
  }

  async function handleConfirmReceive(payload: ReceivePurchaseOrderPayload) {
    if (!orderToReceive) return
    const res = await purchaseService.receivePurchaseOrder(orderToReceive.id, payload)
    showFeedback(res.message)
    await refetchOrders()
  }

  async function handleReportIncident(payload: ReportOrderIncidentPayload) {
    if (!orderToReportIncident) return
    const res = await purchaseService.reportPurchaseOrderIncident(orderToReportIncident.id, payload)
    showFeedback(res.message)
    await refetchOrders()
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {isAdmin ? 'Gestión de Compras y Abastecimiento' : 'Recepción de Compras e Incidencias'}
        </h1>
        <p className={styles.subtitle}>
          {isAdmin
            ? 'Control de solicitudes de reposición, órdenes de compra a proveedores y recepción en almacén'
            : 'Recepción de pedidos de compra a proveedores, verificación conforme y registro de incidencias'}
        </p>
      </header>

      {/* Tabs bar: Only for administrators */}
      {isAdmin && (
        <div className={styles.tabsBar}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'requests' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <span>Solicitudes de Compra</span>
            {pendingRequestsCount > 0 && (
              <span className={styles.tabBadge}>{pendingRequestsCount}</span>
            )}
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span>Órdenes de Compra y Recepción</span>
          </button>
        </div>
      )}

      {feedbackMessage && (
        <div className={styles.feedbackBanner}>
          <span>{feedbackMessage}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {actionError && <div className={styles.errorMessage}>{actionError}</div>}

      {/* TAB 1: Solicitudes de compra (Admin only) */}
      {isAdmin && activeTab === 'requests' && (
        <>
          <div className={styles.controlsBar}>
            <div className={styles.filtersGroup}>
              <input
                type="text"
                placeholder="Buscar por motivo o insumo..."
                className={styles.searchInput}
                value={reqFilters.search ?? ''}
                onChange={(e) => updateReqFilters({ search: e.target.value || undefined })}
              />
              <select
                className={styles.selectFilter}
                value={reqFilters.status ?? ''}
                onChange={(e) => updateReqFilters({ status: e.target.value || undefined })}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobada">Aprobadas</option>
                <option value="rechazada_sin_comprar">Rechazadas</option>
              </select>
            </div>
            <Button type="button" variant="primary" onClick={() => setIsCreateRequestOpen(true)}>
              + Nueva Solicitud
            </Button>
          </div>

          {reqError && <div className={styles.errorMessage}>{reqError}</div>}

          {reqLoading ? (
            <div className={styles.loading}>Cargando solicitudes de compra...</div>
          ) : (
            <PurchaseRequestsTable
              requests={requests}
              onApproveClick={(req) => setRequestToApprove(req)}
              onRejectClick={(req) => setRequestToReject(req)}
              onDetailClick={(req) => {
                if (req.purchase_orders && req.purchase_orders.length > 0) {
                  purchaseService.getPurchaseOrder(req.purchase_orders[0].id).then((res) => {
                    setOrderDetail(res.purchase_order)
                  })
                }
              }}
            />
          )}

          {reqPagination && reqPagination.last_page > 1 && (
            <div className={styles.pagination}>
              <Button
                type="button"
                size="sm"
                variant="accent"
                disabled={reqPagination.current_page <= 1}
                onClick={() => setReqPage(reqPagination.current_page - 1)}
              >
                Anterior
              </Button>
              <span className={styles.pageInfo}>
                Página {reqPagination.current_page} de {reqPagination.last_page}
              </span>
              <Button
                type="button"
                size="sm"
                variant="accent"
                disabled={reqPagination.current_page >= reqPagination.last_page}
                onClick={() => setReqPage(reqPagination.current_page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {/* TAB 2 / Default: Órdenes de compra y recepción */}
      {(activeTab === 'orders' || !isAdmin) && (
        <>
          <div className={styles.controlsBar}>
            <div className={styles.filtersGroup}>
              <input
                type="text"
                placeholder="Buscar por código u orden..."
                className={styles.searchInput}
                value={ordFilters.search ?? ''}
                onChange={(e) => updateOrdFilters({ search: e.target.value || undefined })}
              />
              <select
                className={styles.selectFilter}
                value={ordFilters.supplier_id ?? ''}
                onChange={(e) =>
                  updateOrdFilters({
                    supplier_id: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              >
                <option value="">Todos los proveedores</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company_name}
                  </option>
                ))}
              </select>
              <select
                className={styles.selectFilter}
                value={ordFilters.status ?? ''}
                onChange={(e) => updateOrdFilters({ status: e.target.value || undefined })}
              >
                <option value="">Todos los estados</option>
                <option value="solicitada">Solicitadas (Pendientes entrega)</option>
                <option value="recibida_con_incidencia">Con Incidencia (En corrección)</option>
                <option value="recibida_completa">Recibidas Conformes</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
            {isAdmin && (
              <Button type="button" variant="primary" onClick={() => setIsManualPurchaseOpen(true)}>
                + Registrar Compra Manual
              </Button>
            )}
          </div>

          {ordError && <div className={styles.errorMessage}>{ordError}</div>}

          {ordLoading ? (
            <div className={styles.loading}>Cargando órdenes de compra...</div>
          ) : (
            <PurchaseOrdersTable
              orders={orders}
              onReceiveClick={(order) => setOrderToReceive(order)}
              onReportIncidentClick={(order) => setOrderToReportIncident(order)}
              onDetailClick={(order) => setOrderDetail(order)}
            />
          )}

          {ordPagination && ordPagination.last_page > 1 && (
            <div className={styles.pagination}>
              <Button
                type="button"
                size="sm"
                variant="accent"
                disabled={ordPagination.current_page <= 1}
                onClick={() => setOrdPage(ordPagination.current_page - 1)}
              >
                Anterior
              </Button>
              <span className={styles.pageInfo}>
                Página {ordPagination.current_page} de {ordPagination.last_page}
              </span>
              <Button
                type="button"
                size="sm"
                variant="accent"
                disabled={ordPagination.current_page >= ordPagination.last_page}
                onClick={() => setOrdPage(ordPagination.current_page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {requestToApprove && (
        <ApproveRequestModal
          request={requestToApprove}
          suppliers={suppliers}
          onClose={() => setRequestToApprove(null)}
          onApprove={handleApproveRequest}
        />
      )}

      {requestToReject && (
        <RejectRequestModal
          request={requestToReject}
          onClose={() => setRequestToReject(null)}
          onReject={handleRejectRequest}
        />
      )}

      {isCreateRequestOpen && (
        <CreateRequestModal
          supplies={supplies}
          onClose={() => setIsCreateRequestOpen(false)}
          onSubmit={handleCreateRequest}
        />
      )}

      {isManualPurchaseOpen && (
        <ManualPurchaseModal
          suppliers={suppliers}
          supplies={supplies}
          onClose={() => setIsManualPurchaseOpen(false)}
          onSubmit={handleCreateManualPurchase}
        />
      )}

      {orderToReceive && (
        <ConfirmReceiveModal
          order={orderToReceive}
          onClose={() => setOrderToReceive(null)}
          onConfirm={handleConfirmReceive}
        />
      )}

      {orderToReportIncident && (
        <ReportIncidentModal
          order={orderToReportIncident}
          onClose={() => setOrderToReportIncident(null)}
          onReport={handleReportIncident}
        />
      )}

      {orderDetail && (
        <OrderDetailModal order={orderDetail} onClose={() => setOrderDetail(null)} />
      )}
    </div>
  )
}
