import { useEffect, useState } from 'react'
import * as supplierService from '@/services/supplierService'
import type { DeliveryDay, DeliveryIncidentType } from '@/types/supplier'

export function useDeliveryCatalogs() {
  const [deliveryDays, setDeliveryDays] = useState<DeliveryDay[]>([])
  const [incidentTypes, setIncidentTypes] = useState<DeliveryIncidentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadCatalogs() {
      try {
        const [daysRes, typesRes] = await Promise.all([
          supplierService.getDeliveryDays(),
          supplierService.getDeliveryIncidentTypes(),
        ])
        if (isMounted) {
          setDeliveryDays(daysRes.data)
          setIncidentTypes(typesRes.data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar catálogos de entrega.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCatalogs()

    return () => {
      isMounted = false
    }
  }, [])

  return { deliveryDays, incidentTypes, isLoading, error }
}
