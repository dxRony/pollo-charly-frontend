import { useState } from 'react'
import { Select } from '@/components/atoms/Select'
import { DateRangeFilter } from '@/components/molecules/DateRangeFilter'
import { ExportButtons } from '@/components/molecules/ExportButtons'
import { KpiCard } from '@/components/molecules/KpiCard'
import { DashboardMetricsPanel } from '@/components/organisms/DashboardMetricsPanel'
import { ReportDataTable } from '@/components/organisms/ReportDataTable'
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics'
import { useSalesReport } from '@/hooks/useSalesReport'
import { useTopDishesReport } from '@/hooks/useTopDishesReport'
import { useInventoryMovementsReport } from '@/hooks/useInventoryMovementsReport'
import { useSupplyAlertsReport } from '@/hooks/useSupplyAlertsReport'
import { useCategories } from '@/hooks/useCategories'
import { useUsers } from '@/hooks/useUsers'
import * as reportService from '@/services/reportService'
import { PAYMENT_METHOD_OPTIONS } from '@/types/sale'
import { MOVEMENT_TYPE_OPTIONS, MOVEMENT_TYPE_LABELS } from '@/types/inventoryMovement'
import { ALERT_ORIGIN_LABELS, ALERT_STATUS_LABELS } from '@/types/supplyAlert'
import type { ReportExportFormat } from '@/types/report'
import { formatCurrency as money } from '@/utils/formatCurrency'
import styles from './ReportsPage.module.css'

type ReportTab = 'dashboard' | 'sales' | 'top-dishes' | 'inventory-movements' | 'supply-alerts'

const TABS: { value: ReportTab; label: string }[] = [
  { value: 'dashboard', label: 'Panel general' },
  { value: 'sales', label: 'Ventas' },
  { value: 'top-dishes', label: 'Platillos más vendidos' },
  { value: 'inventory-movements', label: 'Movimientos de inventario' },
  { value: 'supply-alerts', label: 'Alertas de reposición' },
]

function paymentMethodLabel(value: string | null): string {
  return PAYMENT_METHOD_OPTIONS.find((option) => option.value === value)?.label ?? (value ?? '—')
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('dashboard')
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const dashboard = useDashboardMetrics()
  const sales = useSalesReport()
  const topDishes = useTopDishesReport()
  const movements = useInventoryMovementsReport()
  const alerts = useSupplyAlertsReport()
  const { categories } = useCategories()
  const { users } = useUsers()

  async function handleExport<T extends object>(
    reportPath: 'sales' | 'top-dishes' | 'inventory-movements' | 'supply-alerts',
    filters: T,
    format: ReportExportFormat,
    fileSlug: string,
  ) {
    setExportError(null)
    setIsExporting(true)
    try {
      await reportService.exportReport(reportPath, filters, format, `${fileSlug}.${format}`)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'No se pudo generar el archivo.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div>
      <h1 className={styles.title}>Reportes</h1>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={[styles.tab, activeTab === tab.value ? styles.tabActive : ''].join(' ')}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {exportError && <p className={styles.error}>{exportError}</p>}

      {activeTab === 'dashboard' && (
        <section className={styles.section}>
          <DateRangeFilter
            dateFrom={dashboard.filters.date_from ?? ''}
            dateTo={dashboard.filters.date_to ?? ''}
            onDateFromChange={(value) => dashboard.updateFilters({ date_from: value || undefined })}
            onDateToChange={(value) => dashboard.updateFilters({ date_to: value || undefined })}
          />

          {dashboard.error && <p className={styles.error}>{dashboard.error}</p>}
          {dashboard.isLoading && <p className={styles.loading}>Cargando métricas...</p>}
          {dashboard.metrics && <DashboardMetricsPanel metrics={dashboard.metrics} />}
        </section>
      )}

      {activeTab === 'sales' && (
        <section className={styles.section}>
          <div className={styles.filterRow}>
            <DateRangeFilter
              dateFrom={sales.filters.date_from ?? ''}
              dateTo={sales.filters.date_to ?? ''}
              onDateFromChange={(value) => sales.updateFilters({ date_from: value || undefined })}
              onDateToChange={(value) => sales.updateFilters({ date_to: value || undefined })}
            />
            <Select
              value={sales.filters.payment_method ?? ''}
              onChange={(event) => sales.updateFilters({ payment_method: event.target.value || undefined })}
            >
              <option value="">Todos los métodos de pago</option>
              {PAYMENT_METHOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              value={sales.filters.cashier_user_id ?? ''}
              onChange={(event) =>
                sales.updateFilters({
                  cashier_user_id: event.target.value === '' ? undefined : Number(event.target.value),
                })
              }
            >
              <option value="">Todos los cajeros</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
            <ExportButtons
              isExporting={isExporting}
              onExportPdf={() => handleExport('sales', sales.filters, 'pdf', 'reporte-ventas')}
              onExportExcel={() => handleExport('sales', sales.filters, 'xlsx', 'reporte-ventas')}
            />
          </div>

          {sales.error && <p className={styles.error}>{sales.error}</p>}

          {sales.report && (
            <>
              <div className={styles.kpiRow}>
                <KpiCard label="Total vendido" value={money(sales.report.summary.total_sales)} />
                <KpiCard label="N° de ventas" value={String(sales.report.summary.sales_count)} />
                <KpiCard label="Ticket promedio" value={money(sales.report.summary.average_ticket)} />
              </div>

              <ReportDataTable
                columns={[
                  'N° Comprobante',
                  'Fecha',
                  'Comanda',
                  'Mesa',
                  'Cajero',
                  'Método de pago',
                  'Comprobante',
                  'Subtotal',
                  'Descuento',
                  'Total',
                ]}
                rows={sales.report.rows.map((row) => [
                  row.receipt_number,
                  row.date,
                  row.order_code,
                  row.table,
                  row.cashier_name,
                  paymentMethodLabel(row.payment_method),
                  row.receipt_type === 'factura' ? 'Factura' : 'Ticket',
                  money(row.subtotal),
                  money(row.discount),
                  money(row.total),
                ])}
              />
            </>
          )}
        </section>
      )}

      {activeTab === 'top-dishes' && (
        <section className={styles.section}>
          <div className={styles.filterRow}>
            <DateRangeFilter
              dateFrom={topDishes.filters.date_from ?? ''}
              dateTo={topDishes.filters.date_to ?? ''}
              onDateFromChange={(value) => topDishes.updateFilters({ date_from: value || undefined })}
              onDateToChange={(value) => topDishes.updateFilters({ date_to: value || undefined })}
            />
            <Select
              value={topDishes.filters.category_id ?? ''}
              onChange={(event) =>
                topDishes.updateFilters({
                  category_id: event.target.value === '' ? undefined : Number(event.target.value),
                })
              }
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <ExportButtons
              isExporting={isExporting}
              onExportPdf={() => handleExport('top-dishes', topDishes.filters, 'pdf', 'reporte-platillos-mas-vendidos')}
              onExportExcel={() =>
                handleExport('top-dishes', topDishes.filters, 'xlsx', 'reporte-platillos-mas-vendidos')
              }
            />
          </div>

          {topDishes.error && <p className={styles.error}>{topDishes.error}</p>}

          {topDishes.report && (
            <ReportDataTable
              columns={['Platillo', 'Categoría', 'Cantidad vendida', 'Ingresos generados']}
              rows={topDishes.report.rows.map((row) => [
                row.dish_name,
                row.category_name,
                row.quantity_sold,
                money(row.revenue),
              ])}
            />
          )}
        </section>
      )}

      {activeTab === 'inventory-movements' && (
        <section className={styles.section}>
          <div className={styles.filterRow}>
            <DateRangeFilter
              dateFrom={movements.filters.date_from ?? ''}
              dateTo={movements.filters.date_to ?? ''}
              onDateFromChange={(value) => movements.updateFilters({ date_from: value || undefined })}
              onDateToChange={(value) => movements.updateFilters({ date_to: value || undefined })}
            />
            <Select
              value={movements.filters.type ?? ''}
              onChange={(event) => movements.updateFilters({ type: event.target.value || undefined })}
            >
              <option value="">Todos los tipos</option>
              {MOVEMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <ExportButtons
              isExporting={isExporting}
              onExportPdf={() =>
                handleExport('inventory-movements', movements.filters, 'pdf', 'reporte-movimientos-inventario')
              }
              onExportExcel={() =>
                handleExport('inventory-movements', movements.filters, 'xlsx', 'reporte-movimientos-inventario')
              }
            />
          </div>

          {movements.error && <p className={styles.error}>{movements.error}</p>}

          {movements.report && (
            <ReportDataTable
              columns={[
                'Fecha',
                'Insumo',
                'Tipo',
                'Cantidad',
                'Existencia previa',
                'Existencia nueva',
                'Usuario',
                'Motivo',
              ]}
              rows={movements.report.rows.map((row) => [
                row.date,
                row.supply_name,
                row.type ? (MOVEMENT_TYPE_LABELS[row.type] ?? row.type) : '—',
                row.quantity,
                row.previous_stock,
                row.new_stock,
                row.user_name,
                row.reason,
              ])}
            />
          )}
        </section>
      )}

      {activeTab === 'supply-alerts' && (
        <section className={styles.section}>
          <div className={styles.filterRow}>
            <DateRangeFilter
              dateFrom={alerts.filters.date_from ?? ''}
              dateTo={alerts.filters.date_to ?? ''}
              onDateFromChange={(value) => alerts.updateFilters({ date_from: value || undefined })}
              onDateToChange={(value) => alerts.updateFilters({ date_to: value || undefined })}
            />
            <Select
              value={alerts.filters.status ?? ''}
              onChange={(event) => alerts.updateFilters({ status: event.target.value || undefined })}
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="attended">Atendida</option>
            </Select>
            <Select
              value={alerts.filters.origin ?? ''}
              onChange={(event) => alerts.updateFilters({ origin: event.target.value || undefined })}
            >
              <option value="">Todos los orígenes</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automática</option>
            </Select>
            <ExportButtons
              isExporting={isExporting}
              onExportPdf={() =>
                handleExport('supply-alerts', alerts.filters, 'pdf', 'reporte-alertas-reposicion')
              }
              onExportExcel={() =>
                handleExport('supply-alerts', alerts.filters, 'xlsx', 'reporte-alertas-reposicion')
              }
            />
          </div>

          {alerts.error && <p className={styles.error}>{alerts.error}</p>}

          {alerts.report && (
            <ReportDataTable
              columns={['Fecha', 'Insumo', 'Origen', 'Estado', 'Usuario', 'Notas']}
              rows={alerts.report.rows.map((row) => [
                row.date,
                row.supply_name,
                row.origin ? (ALERT_ORIGIN_LABELS[row.origin] ?? row.origin) : '—',
                row.status ? (ALERT_STATUS_LABELS[row.status] ?? row.status) : '—',
                row.user_name,
                row.notes,
              ])}
            />
          )}
        </section>
      )}
    </div>
  )
}
