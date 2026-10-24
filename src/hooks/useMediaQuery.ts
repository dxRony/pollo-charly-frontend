import { useSyncExternalStore } from 'react'

/** Indica si la ventana cumple una media query CSS y se actualiza al cambiar el tamaño de la pantalla. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', notify)
      return () => mediaQuery.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
