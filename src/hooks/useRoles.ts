import { useEffect, useState } from 'react'
import * as userService from '@/services/userService'
import type { Role } from '@/types/auth'

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    userService
      .getRoles()
      .then(setRoles)
      .finally(() => setIsLoading(false))
  }, [])

  return { roles, isLoading }
}
