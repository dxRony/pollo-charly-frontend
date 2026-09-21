import { useEffect, useState } from 'react'
import * as categoryService from '@/services/categoryService'
import type { Category } from '@/types/category'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false))
  }, [])

  return { categories, isLoading }
}
