import type { Order } from './order'

export type PaymentMethodAlias = 'efectivo' | 'tarjeta' | 'transferencia'
export type ReceiptTypeAlias = 'ticket' | 'factura'

export interface SaleCashierRef {
  id: number
  name: string
  email: string
}

export interface Sale {
  id: number
  order_id: number
  order: Order | null
  cashier_user_id: number
  cashier: SaleCashierRef | null
  receipt_type_id: number
  receipt_type: string
  payment_method_id: number
  payment_method: string
  sale_status_id: number
  sale_status: string
  receipt_number: string
  subtotal: number
  discount: number
  tax: number
  total: number
  received_amount: number
  change_amount: number
  created_at: string
}

export interface RegisterSalePayload {
  payment_method: PaymentMethodAlias
  received_amount?: number
  receipt_type?: ReceiptTypeAlias
}

export interface SaleMutationResponse {
  message: string
  sale: Sale
}

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethodAlias; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
]

export const RECEIPT_TYPE_OPTIONS: { value: ReceiptTypeAlias; label: string }[] = [
  { value: 'ticket', label: 'Ticket' },
  { value: 'factura', label: 'Factura' },
]
