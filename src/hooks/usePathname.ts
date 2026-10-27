import { useSyncExternalStore } from 'react'
import { subscribeToRoute } from '@/lib/router'

/** Percorso corrente dell'URL, aggiornato a ogni navigazione. */
export function usePathname(): string {
  return useSyncExternalStore(
    subscribeToRoute,
    () => window.location.pathname,
    () => '/',
  )
}
