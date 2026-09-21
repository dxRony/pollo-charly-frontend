import { useEffect, useState } from 'react'
import * as supplyService from '@/services/supplyService'
import type { MeasurementUnit } from '@/types/supply'

export function useMeasurementUnits() {
  const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supplyService
      .getMeasurementUnits()
      .then(setMeasurementUnits)
      .finally(() => setIsLoading(false))
  }, [])

  return { measurementUnits, isLoading }
}
