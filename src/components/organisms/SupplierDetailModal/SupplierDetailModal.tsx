import { useEffect, useState } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Modal } from '@/components/molecules/Modal'
import * as supplierService from '@/services/supplierService'
import type { DeliveryIncident, PurchaseOrder, Supplier } from '@/types/supplier'
import styles from './SupplierDetailModal.module.css'

interface SupplierDetailModalProps {
  supplierId: number
  onClose: () => void
  onRecordDeliveryClick?: () => void
}

export function SupplierDetailModal({
  supplierId,
  onClose,
  onRecordDeliveryClick,
}: SupplierDetailModalProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [incidents, setIncidents] = useState<DeliveryIncident[]>([])
  const [activeTab, setActiveTab] = useState<'orders' | 'incidents' | 'supplies'>('orders')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDetail() {
      setIsLoading(true)
      try {
        const [supplierRes, historyRes] = await Promise.all([
          supplierService.getSupplier(supplierId),
          supplierService.getSupplierHistory(supplierId),
        ])

        if (isMounted) {
          setSupplier(supplierRes.data)
          setPurchaseOrders(historyRes.purchase_orders || supplierRes.data.purchase_orders || [])
          setIncidents(historyRes.delivery_incidents || supplierRes.data.delivery_incidents || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar el detalle del proveedor.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDetail()

    return () => {
      isMounted = false
    }
  }, [supplierId])

  if (isLoading) {
    return (
      <Modal title="Cargando proveedor..." onClose={onClose}>
        <p className={styles.loading}>Consultando información, productos e historial...</p>
      </Modal>
    )
  }

  if (error || !supplier) {
    return (
      <Modal title="Error" onClose={onClose}>
        <p className={styles.error}>{error || 'No se pudo encontrar el proveedor.'}</p>
        <div className={styles.footerActions}>
          <Button type="button" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </Modal>
    )
  }

  const performance = supplier.performance
  const complianceRate = performance?.compliance_rate

  return (
    <Modal title={`Ficha del Proveedor: ${supplier.company_name}`} onClose={onClose}>
      <div className={styles.container}>
        {/* Cabecera de Contacto */}
        <div className={styles.headerCard}>
          <div className={styles.headerMain}>
            <div>
              <h3 className={styles.companyTitle}>{supplier.company_name}</h3>
              <p className={styles.contactSubtitle}>
                {supplier.contact_name ? `Contacto: ${supplier.contact_name}` : 'Sin contacto registrado'}
              </p>
            </div>
            <div className={styles.headerBadges}>
              <Badge tone={supplier.is_active ? 'success' : 'neutral'}>
                {supplier.is_active ? 'Activo' : 'Inactivo (Baja lógica)'}
              </Badge>
              {supplier.is_active && onRecordDeliveryClick && (
                <Button type="button" size="sm" variant="primary" onClick={onRecordDeliveryClick}>
                  📥 Recibir Entrega
                </Button>
              )}
            </div>
          </div>

          <div className={styles.contactGrid}>
            <div>
              <span className={styles.fieldLabel}>Teléfono:</span>
              <span className={styles.fieldValue}>{supplier.phone || 'No registrado'}</span>
            </div>
            <div>
              <span className={styles.fieldLabel}>Correo:</span>
              <span className={styles.fieldValue}>{supplier.email || 'No registrado'}</span>
            </div>
            <div className={styles.fullRow}>
              <span className={styles.fieldLabel}>Dirección:</span>
              <span className={styles.fieldValue}>{supplier.address || 'No registrada'}</span>
            </div>
            <div className={styles.fullRow}>
              <span className={styles.fieldLabel}>Días de Entrega:</span>
              <div className={styles.daysContainer}>
                {supplier.delivery_days && supplier.delivery_days.length > 0 ? (
                  supplier.delivery_days.map((day) => (
                    <span key={day.id} className={styles.dayTag}>
                      {day.name}
                    </span>
                  ))
                ) : (
                  <span className={styles.mutedText}>Sin días fijos especificados</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas KPI de Desempeño */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiNumber}>{performance?.total_orders ?? purchaseOrders.length}</span>
            <span className={styles.kpiLabel}>Entregas registradas</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={`${styles.kpiNumber} ${styles.kpiSuccess}`}>
              {performance?.completed_orders ??
                purchaseOrders.filter((po) => po.purchase_order_status_id === 2).length}
            </span>
            <span className={styles.kpiLabel}>Conformes sin problema</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={`${styles.kpiNumber} ${styles.kpiDanger}`}>
              {performance?.total_incidents ?? incidents.length}
            </span>
            <span className={styles.kpiLabel}>Incidencias reportadas</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiNumber}>
              {complianceRate !== null && complianceRate !== undefined
                ? `${complianceRate.toFixed(1)}%`
                : '100%'}
            </span>
            <span className={styles.kpiLabel}>Tasa de cumplimiento</span>
          </div>
        </div>

        {/* Pestañas de Navegación de Detalle */}
        <div className={styles.tabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🚚 Historial de Compras y Entregas ({purchaseOrders.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'incidents' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('incidents')}
          >
            ⚠️ Historial de Incidencias ({incidents.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'supplies' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('supplies')}
          >
            📦 Productos y Precios Pactados ({supplier.supplies?.length ?? 0})
          </button>
        </div>

        {/* Contenido de la Pestaña Activa */}
        <div className={styles.tabContent}>
          {activeTab === 'orders' && (
            <div>
              {purchaseOrders.length === 0 ? (
                <p className={styles.emptyNotice}>
                  Aún no hay compras o entregas registradas en el historial de este proveedor.
                </p>
              ) : (
                <div className={styles.historyList}>
                  {purchaseOrders.map((order) => {
                    const isCompleted = order.purchase_order_status_id === 2 || order.status === 'recibida_completa'
                    const hasIncident = order.purchase_order_status_id === 3 || order.status === 'recibida_con_incidencia'

                    return (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div>
                            <span className={styles.orderCode}>{order.code}</span>
                            <span className={styles.orderDate}>
                              Fecha:{' '}
                              {order.received_date
                                ? new Date(order.received_date).toLocaleDateString()
                                : order.expected_date
                                  ? new Date(order.expected_date).toLocaleDateString()
                                  : 'Reciente'}
                            </span>
                          </div>
                          <div>
                            <Badge tone={isCompleted ? 'success' : hasIncident ? 'warning' : 'neutral'}>
                              {isCompleted
                                ? 'Recibida Completa'
                                : hasIncident
                                  ? 'Recibida con Incidencia'
                                  : order.status}
                            </Badge>
                          </div>
                        </div>

                        {order.total > 0 && (
                          <div className={styles.orderTotal}>
                            Total: Q{order.total.toFixed(2)}
                          </div>
                        )}

                        {order.items && order.items.length > 0 && (
                          <div className={styles.orderItems}>
                            <span className={styles.itemsTitle}>Detalle de insumos recibidos:</span>
                            <ul>
                              {order.items.map((it) => (
                                <li key={it.id}>
                                  {it.supply_name}: {it.received_quantity ?? it.ordered_quantity}{' '}
                                  {it.measurement_unit} (Q{it.unit_price.toFixed(2)} c/u)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'incidents' && (
            <div>
              {incidents.length === 0 ? (
                <p className={styles.emptyNoticeSuccess}>
                  ✓ ¡Excelente! Este proveedor no tiene incidencias registradas. Sus entregas se han recibido conformes.
                </p>
              ) : (
                <div className={styles.historyList}>
                  {incidents.map((incident) => {
                    const typeLabel =
                      incident.type === 'peso_incompleto'
                        ? 'Diferencia de peso / Incompleto'
                        : incident.type === 'producto_danado'
                          ? 'Problema de calidad / Dañado'
                          : incident.type === 'retraso'
                            ? 'Retraso en entrega'
                            : incident.type === 'producto_equivocado'
                              ? 'Producto equivocado'
                              : incident.type

                    return (
                      <div key={incident.id} className={styles.incidentCard}>
                        <div className={styles.incidentHeader}>
                          <span className={styles.incidentTypeBadge}>⚠️ {typeLabel}</span>
                          <span className={styles.incidentDate}>
                            {incident.created_at
                              ? new Date(incident.created_at).toLocaleString()
                              : 'Reciente'}
                          </span>
                        </div>

                        <p className={styles.incidentDesc}>{incident.description}</p>

                        <div className={styles.incidentFooter}>
                          <span>
                            Recibido por: <strong>{incident.receiving_user_name || 'Personal en turno'}</strong>
                          </span>
                          <Badge tone={incident.status === 'resuelta' ? 'success' : 'warning'}>
                            Estado: {incident.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'supplies' && (
            <div>
              {!supplier.supplies || supplier.supplies.length === 0 ? (
                <p className={styles.emptyNotice}>
                  No hay productos asignados a este proveedor.
                </p>
              ) : (
                <table className={styles.suppliesTable}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Insumo</th>
                      <th>Unidad de Medida</th>
                      <th>Precio Pactado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.supplies.map((s) => (
                      <tr key={s.id}>
                        <td><code>{s.code}</code></td>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.measurement_unit}</td>
                        <td className={styles.priceCell}>Q{s.agreed_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div className={styles.footerActions}>
          <Button type="button" onClick={onClose}>
            Cerrar Ficha
          </Button>
        </div>
      </div>
    </Modal>
  )
}
