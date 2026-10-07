import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import type { Supplier } from '@/types/supplier'
import styles from './SuppliersTable.module.css'

interface SuppliersTableProps {
  suppliers: Supplier[]
  canManage: boolean
  onViewDetail: (supplier: Supplier) => void
  onRecordDelivery: (supplier: Supplier) => void
  onEdit: (supplier: Supplier) => void
  onToggleStatus: (supplier: Supplier) => void
}

export function SuppliersTable({
  suppliers,
  canManage,
  onViewDetail,
  onRecordDelivery,
  onEdit,
  onToggleStatus,
}: SuppliersTableProps) {
  if (suppliers.length === 0) {
    return <p className={styles.empty}>No se encontraron proveedores con los filtros seleccionados.</p>
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Empresa / Razón Social</th>
            <th>Contacto</th>
            <th>Días de Entrega</th>
            <th>Insumos</th>
            <th>Entregas / Incidencias</th>
            <th>Cumplimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => {
            const performance = supplier.performance
            const complianceRate = performance?.compliance_rate

            return (
              <tr key={supplier.id} className={!supplier.is_active ? styles.inactiveRow : undefined}>
                <td>
                  <div className={styles.companyName}>{supplier.company_name}</div>
                  {supplier.address && <div className={styles.address}>{supplier.address}</div>}
                </td>
                <td>
                  <div className={styles.contactName}>{supplier.contact_name || '—'}</div>
                  <div className={styles.contactDetail}>
                    {supplier.phone && <span>📞 {supplier.phone}</span>}
                    {supplier.email && <span>✉️ {supplier.email}</span>}
                  </div>
                </td>
                <td>
                  <div className={styles.daysList}>
                    {supplier.delivery_days && supplier.delivery_days.length > 0 ? (
                      supplier.delivery_days.map((day) => (
                        <span key={day.id} className={styles.dayBadge}>
                          {day.name.substring(0, 3)}
                        </span>
                      ))
                    ) : (
                      <span className={styles.muted}>Sin días fijos</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={styles.suppliesCount}>
                    📦 {supplier.supplies ? supplier.supplies.length : 0} insumos
                  </span>
                </td>
                <td>
                  <div className={styles.historyCounts}>
                    <span>🚚 {supplier.purchase_orders_count ?? 0} entregas</span>
                    {(supplier.delivery_incidents_count ?? 0) > 0 ? (
                      <span className={styles.incidentAlert}>
                        ⚠️ {supplier.delivery_incidents_count} incidencias
                      </span>
                    ) : (
                      <span className={styles.successText}>✓ 0 incidencias</span>
                    )}
                  </div>
                </td>
                <td>
                  {complianceRate !== null && complianceRate !== undefined ? (
                    <Badge tone={complianceRate >= 90 ? 'success' : complianceRate >= 70 ? 'warning' : 'neutral'}>
                      {complianceRate.toFixed(1)}%
                    </Badge>
                  ) : (
                    <span className={styles.muted}>N/D</span>
                  )}
                </td>
                <td>
                  <Badge tone={supplier.is_active ? 'success' : 'neutral'}>
                    {supplier.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onViewDetail(supplier)}
                      title="Ver detalle e historial completo"
                    >
                      Detalle
                    </Button>
                    {supplier.is_active && (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => onRecordDelivery(supplier)}
                        title="Registrar entrega o reporte de incidencia"
                      >
                        Recibir Entrega
                      </Button>
                    )}
                    {canManage && (
                      <>
                        {supplier.is_active && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onEdit(supplier)}
                          >
                            Editar
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant={supplier.is_active ? 'accent' : 'primary'}
                          onClick={() => onToggleStatus(supplier)}
                          title={supplier.is_active ? 'Desactivar proveedor (baja lógica)' : 'Reactivar proveedor'}
                        >
                          {supplier.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
