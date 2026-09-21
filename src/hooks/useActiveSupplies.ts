import { useEffect, useState } from 'react'
import * as supplyService from '@/services/supplyService'
import type { Supply } from '@/types/supply'

export function useActiveSupplies() {
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supplyService
      .getSupplies({ is_active: true, per_page: 100 })
      .then((response) => setSupplies(response.data))
      .finally(() => setIsLoading(false))
  }, [])

  return { supplies, isLoading }
}
