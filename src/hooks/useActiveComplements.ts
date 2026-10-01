import { useEffect, useState } from 'react'
import * as complementService from '@/services/complementService'
import type { Complement } from '@/types/complement'

export function useActiveComplements() {
  const [complements, setComplements] = useState<Complement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    complementService
      .getComplements({ is_active: true, per_page: 100 })
      .then((response) => setComplements(response.data))
      .finally(() => setIsLoading(false))
  }, [])

  return { complements, isLoading }
}
