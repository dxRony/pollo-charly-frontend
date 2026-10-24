import type { SalesByDayPoint, SalesByPaymentMethodPoint, SalesReportRow } from '@/types/report'
import { parseDay } from '@/utils/formatShortDate'

/** Por encima de este rango no se rellenan los días sin datos para no generar cientos de barras vacías. */
const MAX_FILLED_DAYS = 120

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// `type` (y no `interface`) para que sean asignables a los datos con claves dinámicas de las gráficas.
export type RankedItem = { label: string; value: number }

export type WeekdayAverage = { label: string; value: number }

export type DailyBucket = Record<string, number | string>

/** Extrae "YYYY-MM-DD" de una fecha "YYYY-MM-DD HH:mm". */
export function dayKey(dateTime: string): string {
  return dateTime.slice(0, 10)
}

function toDayString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Eje de días continuo entre dateFrom y dateTo (o el primer y último día con datos),
 * para que los días sin movimiento aparezcan en cero en vez de unirse en la gráfica.
 */
export function buildDayAxis(daysWithData: string[], dateFrom?: string, dateTo?: string): string[] {
  const present = [...new Set(daysWithData)].sort()
  const start = dateFrom || present[0]
  const end = dateTo || present[present.length - 1]

  if (!start || !end) {
    return present
  }

  const axis: string[] = []
  const cursor = parseDay(start)
  const last = parseDay(end)

  while (cursor <= last && axis.length <= MAX_FILLED_DAYS) {
    axis.push(toDayString(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return axis.length === 0 || axis.length > MAX_FILLED_DAYS ? present : axis
}

export function aggregateSalesByDay(rows: SalesReportRow[]): SalesByDayPoint[] {
  const byDay = new Map<string, SalesByDayPoint>()

  for (const row of rows) {
    const date = dayKey(row.date)
    const point = byDay.get(date) ?? { date, total: 0, count: 0 }

    point.total += row.total
    point.count += 1
    byDay.set(date, point)
  }

  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export function aggregateSalesByPaymentMethod(rows: SalesReportRow[]): SalesByPaymentMethodPoint[] {
  const byMethod = new Map<string, SalesByPaymentMethodPoint>()

  for (const row of rows) {
    if (!row.payment_method) {
      continue
    }

    const point = byMethod.get(row.payment_method) ?? { payment_method: row.payment_method, total: 0, count: 0 }

    point.total = Math.round((point.total + row.total) * 100) / 100
    point.count += 1
    byMethod.set(row.payment_method, point)
  }

  return [...byMethod.values()]
}

export function fillSalesByDay(
  points: SalesByDayPoint[],
  dateFrom?: string,
  dateTo?: string,
): SalesByDayPoint[] {
  const byDay = new Map(points.map((point) => [point.date, point]))
  const axis = buildDayAxis(
    points.map((point) => point.date),
    dateFrom,
    dateTo,
  )

  return axis.map((date) => byDay.get(date) ?? { date, total: 0, count: 0 })
}

/** Promedio de ventas por día para cada día de la semana, con semana iniciando en lunes. */
export function averageSalesByWeekday(filledPoints: SalesByDayPoint[]): WeekdayAverage[] {
  const totals = WEEKDAY_LABELS.map(() => ({ sum: 0, days: 0 }))

  for (const point of filledPoints) {
    const index = (parseDay(point.date).getDay() + 6) % 7

    totals[index].sum += point.total
    totals[index].days += 1
  }

  return WEEKDAY_LABELS.map((label, index) => ({
    label,
    value: totals[index].days > 0 ? Math.round((totals[index].sum / totals[index].days) * 100) / 100 : 0,
  }))
}

export function sumByDay<T>(
  rows: T[],
  getDate: (row: T) => string,
  getValue: (row: T) => number,
  dateFrom?: string,
  dateTo?: string,
): { date: string; value: number }[] {
  const totals = new Map<string, number>()

  for (const row of rows) {
    const day = dayKey(getDate(row))

    totals.set(day, (totals.get(day) ?? 0) + getValue(row))
  }

  return buildDayAxis([...totals.keys()], dateFrom, dateTo).map((date) => ({
    date,
    value: Math.round((totals.get(date) ?? 0) * 100) / 100,
  }))
}

/** Cuenta registros por día y categoría; cada día trae todas las categorías (en cero si no hubo). */
export function countByDayAndCategory<T>(
  rows: T[],
  getDate: (row: T) => string,
  getCategory: (row: T) => string | null,
  categories: readonly string[],
  dateFrom?: string,
  dateTo?: string,
): DailyBucket[] {
  const counts = new Map<string, Record<string, number>>()

  for (const row of rows) {
    const category = getCategory(row)

    if (category === null || !categories.includes(category)) {
      continue
    }

    const day = dayKey(getDate(row))
    const bucket = counts.get(day) ?? Object.fromEntries(categories.map((name) => [name, 0]))

    bucket[category] += 1
    counts.set(day, bucket)
  }

  const empty = Object.fromEntries(categories.map((name) => [name, 0]))

  return buildDayAxis([...counts.keys()], dateFrom, dateTo).map((date) => ({
    date,
    ...(counts.get(date) ?? empty),
  }))
}

export function rankBy<T>(
  rows: T[],
  getLabel: (row: T) => string | null,
  getValue: (row: T) => number,
  limit?: number,
): RankedItem[] {
  const totals = new Map<string, number>()

  for (const row of rows) {
    const label = getLabel(row)

    if (!label) {
      continue
    }

    totals.set(label, (totals.get(label) ?? 0) + getValue(row))
  }

  const ranked = [...totals.entries()]
    .map(([label, value]) => ({ label, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value)

  return limit === undefined ? ranked : ranked.slice(0, limit)
}

/**
 * Escala con marcas "redondas" (1, 2, 2.5, 5 × 10ⁿ) desde cero hasta un máximo que cubre el valor más alto,
 * para que el eje no muestre cortes irregulares como 750 o 2,250.
 */
export function niceScale(maxValue: number, options: { integer?: boolean; targetTicks?: number } = {}) {
  const { integer = false, targetTicks = 4 } = options

  if (!(maxValue > 0)) {
    return { max: 1, ticks: [0, 1] }
  }

  const rawStep = maxValue / targetTicks
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const multipliers = integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10]
  const step = Math.max(
    integer ? 1 : 0,
    (multipliers.map((multiplier) => multiplier * magnitude).find((candidate) => candidate >= rawStep) ??
      10 * magnitude),
  )
  const count = Math.ceil(maxValue / step)

  return {
    max: step * count,
    ticks: Array.from({ length: count + 1 }, (_, index) => step * index),
  }
}
