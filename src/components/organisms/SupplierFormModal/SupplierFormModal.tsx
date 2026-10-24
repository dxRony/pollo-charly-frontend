import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { useActiveSupplies } from '@/hooks/useActiveSupplies'
import { useDeliveryCatalogs } from '@/hooks/useDeliveryCatalogs'
import { ApiError } from '@/services/api'
import type {
  CreateSupplierPayload,
  Supplier,
  SupplierSupplyItemPayload,
  UpdateSupplierPayload,
} from '@/types/supplier'
import styles from './SupplierFormModal.module.css'

interface SupplierFormModalProps {
  initialData?: Supplier | null
  onClose: () => void
  onSubmit: (payload: CreateSupplierPayload | UpdateSupplierPayload) => Promise<void>
}

interface SupplyRow {
  supply_id: number
  agreed_price: string
}

export function SupplierFormModal({ initialData, onClose, onSubmit }: SupplierFormModalProps) {
  const isEditing = Boolean(initialData)
  const { supplies: catalogSupplies } = useActiveSupplies()
  const { deliveryDays } = useDeliveryCatalogs()

  const [companyName, setCompanyName] = useState(initialData?.company_name ?? '')
  const [contactName, setContactName] = useState(initialData?.contact_name ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [address, setAddress] = useState(initialData?.address ?? '')
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialData?.delivery_days?.map((d) => d.id) ?? [],
  )
  const [supplyRows, setSupplyRows] = useState<SupplyRow[]>(
    initialData?.supplies?.map((s) => ({
      supply_id: s.supply_id,
      agreed_price: String(s.agreed_price),
    })) ?? [],
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleDay(dayId: number) {
    setSelectedDays((prev) => {
      const next = prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
      if (next.length > 0) {
        setErrors((errs) => {
          const updated = { ...errs }
          delete updated.delivery_day_ids
          return updated
        })
      }
      return next
    })
  }

  function handleAddSupplyRow() {
    const availableSupply = catalogSupplies.find(
      (s) => !supplyRows.some((row) => row.supply_id === s.id),
    )
    if (!availableSupply) {
      return
    }

    setSupplyRows((prev) => [
      ...prev,
      { supply_id: availableSupply.id, agreed_price: String(availableSupply.unit_cost ?? '') },
    ])
  }

  function handleRemoveSupplyRow(index: number) {
    setSupplyRows((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSupplyChange(index: number, supplyId: number) {
    setSupplyRows((prev) => {
      const updated = [...prev]
      const found = catalogSupplies.find((s) => s.id === supplyId)
      updated[index] = {
        supply_id: supplyId,
        agreed_price: found ? String(found.unit_cost) : updated[index].agreed_price,
      }
      return updated
    })
  }

  function handlePriceChange(index: number, priceStr: string) {
    setSupplyRows((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], agreed_price: priceStr }
      return updated
    })
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!companyName.trim()) {
      newErrors.company_name = 'El nombre de la empresa o razón social es obligatorio.'
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'El formato del correo electrónico no es válido.'
    }

    if (selectedDays.length === 0) {
      newErrors.delivery_day_ids = 'Debe seleccionar al menos un día de entrega.'
    }

    const seenSupplies = new Set<number>()
    supplyRows.forEach((row, idx) => {
      if (seenSupplies.has(row.supply_id)) {
        newErrors[`supply_${idx}`] = 'Este insumo ya fue agregado en la lista.'
      }
      seenSupplies.add(row.supply_id)

      const price = parseFloat(row.agreed_price)
      if (isNaN(price) || price < 0) {
        newErrors[`supply_${idx}`] = 'El precio acordado debe ser un número mayor o igual a 0.'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setGeneralError(null)

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    const formattedSupplies: SupplierSupplyItemPayload[] = supplyRows
      .filter((row) => row.supply_id > 0 && !isNaN(parseFloat(row.agreed_price)))
      .map((row) => ({
        supply_id: row.supply_id,
        agreed_price: parseFloat(row.agreed_price),
      }))

    const payload: CreateSupplierPayload = {
      company_name: companyName.trim(),
      contact_name: contactName.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      delivery_day_ids: selectedDays,
      supplies: formattedSupplies,
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.errors) {
        const backendErrors: Record<string, string> = {}
        Object.entries(err.errors).forEach(([field, msgs]) => {
          backendErrors[field] = Array.isArray(msgs) ? msgs[0] : String(msgs)
        })
        setErrors(backendErrors)
      } else {
        setGeneralError(err instanceof Error ? err.message : 'Error al guardar el proveedor.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={isEditing ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {generalError && <div className={styles.alertDanger}>{generalError}</div>}

        <div className={styles.sectionTitle}>1. Información de contacto</div>

        <FormField
          label="Empresa / Razón Social *"
          name="company_name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={errors.company_name}
          placeholder="Ej: Distribuidora Avícola"
        />

        <div className={styles.gridTwo}>
          <FormField
            label="Persona de Contacto"
            name="contact_name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            error={errors.contact_name}
            placeholder="Ej: Juan Pérez"
          />
          <FormField
            label="Teléfono"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="Ej: 555-1234"
          />
        </div>

        <div className={styles.gridTwo}>
          <FormField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="Ej: ventas@proveedor.com"
          />
          <FormField
            label="Dirección"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
            placeholder="Ej: Calzada San Juan 14-22, Zona 7"
          />
        </div>

        <div className={styles.sectionTitle}>2. Días de entrega habituales *</div>
        <div className={styles.daysGrid}>
          {deliveryDays.map((day) => {
            const isChecked = selectedDays.includes(day.id)
            return (
              <label key={day.id} className={`${styles.dayCheckbox} ${isChecked ? styles.dayActive : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDay(day.id)}
                />
                <span>{day.name}</span>
              </label>
            )
          })}
        </div>
        {errors.delivery_day_ids && (
          <span className={styles.fieldError}>{errors.delivery_day_ids}</span>
        )}

        <div className={styles.sectionTitle}>
          <span>3. Productos / Insumos y precios acordados</span>
          <Button
            type="button"
            size="sm"
            onClick={handleAddSupplyRow}
            disabled={catalogSupplies.length === 0 || supplyRows.length >= catalogSupplies.length || isSubmitting}
            title={supplyRows.length >= catalogSupplies.length ? 'Todos los insumos del catálogo ya están agregados' : undefined}
          >
            + Agregar Insumo
          </Button>
        </div>

        {supplyRows.length === 0 ? (
          <p className={styles.emptySupplies}>
            No se han asignado insumos para este proveedor. Presiona "+ Agregar Insumo" para registrar los productos que abastece y sus precios pactados.
          </p>
        ) : (
          <div>
            <div className={styles.tableHeaders}>
              <span className={styles.headerSupplyCol}>Insumo *</span>
              <span className={styles.headerPriceCol}>Precio acordado (Q) *</span>
              <span className={styles.headerActionCol}></span>
            </div>
            <div className={styles.suppliesTable}>
              {supplyRows.map((row, index) => {
                const rowError = errors[`supply_${index}`] || errors[`supplies.${index}.agreed_price`]
                return (
                  <div key={index} className={styles.supplyRow}>
                    <div className={styles.supplySelectCol}>
                      <select
                        className={styles.select}
                        value={row.supply_id}
                        onChange={(e) => handleSupplyChange(index, Number(e.target.value))}
                      >
                        {catalogSupplies.map((s) => {
                          const isAlreadySelected = supplyRows.some(
                            (r, i) => i !== index && r.supply_id === s.id,
                          )
                          return (
                            <option key={s.id} value={s.id} disabled={isAlreadySelected}>
                              {s.name} ({s.code}) - {s.measurement_unit?.abbreviation ?? ''}
                              {isAlreadySelected ? ' (Ya agregado)' : ''}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className={styles.supplyPriceCol}>
                      <div className={styles.priceInputWrapper}>
                        <span className={styles.currencyPrefix}>Q</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={styles.inputPrice}
                          placeholder="Precio acordado"
                          value={row.agreed_price}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                        />
                      </div>
                      {rowError && <span className={styles.fieldError}>{rowError}</span>}
                    </div>
                    <button
                      type="button"
                      className={styles.removeRowBtn}
                      onClick={() => handleRemoveSupplyRow(index)}
                      title="Eliminar insumo"
                    >
                      🗑️
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
