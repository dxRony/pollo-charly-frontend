import { useEffect, useState } from 'react'
import * as supplierService from '@/services/supplierService'
import type { Supplier } from '@/types/supplier'

export function useActiveSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supplierService
      .getSuppliers({ is_active: true, per_page: 100 })
      .then((response) => setSuppliers(response.data))
      .catch(() => setSuppliers([]))
      .finally(() => setIsLoading(false))
  }, [])

  return { suppliers, isLoading }
}
