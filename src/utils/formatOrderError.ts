import { ApiError } from '@/services/api'

export function formatOrderError(err: unknown, fallback = 'No se pudo procesar la comanda.'): string {
  if (err instanceof ApiError && err.insufficientSupplies && err.insufficientSupplies.length > 0) {
    const details = err.insufficientSupplies
      .map(
        (supply) =>
          `${supply.name}: requiere ${supply.required} ${supply.unit}, disponible ${supply.available} ${supply.unit}`,
      )
      .join(' · ')
    return `${err.message} ${details}`
  }
  if (err instanceof ApiError && err.errors) {
    return Object.values(err.errors).flat().join(' ')
  }
  return err instanceof Error ? err.message : fallback
}
