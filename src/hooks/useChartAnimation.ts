import { useMediaQuery } from '@/hooks/useMediaQuery'

/** Las gráficas se animan al aparecer, salvo que la persona haya pedido reducir el movimiento. */
export function useChartAnimation(): boolean {
  return !useMediaQuery('(prefers-reduced-motion: reduce)')
}
