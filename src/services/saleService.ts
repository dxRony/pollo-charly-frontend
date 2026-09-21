import { apiFetch } from './api'
import type { RegisterSalePayload, SaleMutationResponse } from '@/types/sale'

export function registerSale(
  orderId: number,
  payload: RegisterSalePayload,
): Promise<SaleMutationResponse> {
  return apiFetch<SaleMutationResponse>(`/orders/${orderId}/pay`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
