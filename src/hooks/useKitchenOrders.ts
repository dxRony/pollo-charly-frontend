import { useCallback, useEffect, useState } from 'react'
import { createEcho } from '@/services/echo'
import * as orderService from '@/services/orderService'
import type { ComandaEventPayload, Order } from '@/types/order'

export function useKitchenOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      const response = await orderService.getKitchenOrders()
      setOrders(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las comandas de cocina.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Sincronización inicial vía REST; el respaldo de reconexión se maneja abajo
    // en el listener "subscribed" del canal, no hay valor calculable de forma síncrona.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders()

    const echo = createEcho()
    const channel = echo.private('cocina')

    function upsertOrder(order: Order) {
      setOrders((previous) => {
        const exists = previous.some((existing) => existing.id === order.id)
        return exists
          ? previous.map((existing) => (existing.id === order.id ? order : existing))
          : [...previous, order]
      })
    }

    function removeOrder(orderId: number) {
      setOrders((previous) => previous.filter((existing) => existing.id !== orderId))
    }

    channel.subscribed(() => {
      setIsConnected(true)
      // Re-sincroniza el listado completo tras (re)conectar, para no depender
      // de eventos que pudieron perderse durante una desconexión.
      fetchOrders()
    })
    channel.error(() => setIsConnected(false))

    channel.listen('.ComandaEnviadaACocina', (payload: ComandaEventPayload) => {
      upsertOrder(payload.order)
    })
    channel.listen('.ComandaModificada', (payload: ComandaEventPayload) => {
      upsertOrder(payload.order)
    })
    channel.listen('.ComandaCancelada', (payload: ComandaEventPayload) => {
      removeOrder(payload.order.id)
    })
    channel.listen('.ComandaEstadoActualizado', (payload: ComandaEventPayload) => {
      if (payload.new_status === 'en_preparacion') {
        upsertOrder(payload.order)
      } else {
        // 'lista' (o cualquier estado posterior) ya no pertenece a la vista activa de cocina.
        removeOrder(payload.order.id)
      }
    })

    return () => {
      echo.leave('cocina')
      echo.disconnect()
    }
  }, [fetchOrders])

  return { orders, isLoading, error, isConnected, refetch: fetchOrders }
}
