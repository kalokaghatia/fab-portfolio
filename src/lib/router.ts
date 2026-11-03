/*
 * Router minimo basato sulla History API: niente dipendenze, URL veri
 * (es. /work/il-viaggio-per-amarsi) e tasto Indietro del browser funzionante.
 */

export interface RouteState {
  /** true se la pagina è stata aperta da un click dentro il sito. */
  fromSite?: boolean
  /**
   * Quante pagine (progetti, journal) sono state aperte una sopra l'altra a partire
   * dalla homepage: Close torna indietro di tutte in un colpo solo.
   */
  depth?: number
}

const listeners = new Set<() => void>()

export function subscribeToRoute(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('popstate', onChange)
  }
}

export function navigate(to: string, state: RouteState = {}) {
  if (to === window.location.pathname + window.location.hash) return
  const current = window.history.state as RouteState | null
  const depth = state.fromSite
    ? window.location.pathname === '/'
      ? 1
      : (current?.depth ?? 0) + 1
    : 0
  window.history.pushState({ ...state, depth }, '', to)
  listeners.forEach((listener) => listener())
}

export function projectPath(slug: string) {
  return `/work/${slug}`
}

export const japanPath = '/japan'

/** Indirizzo di una tappa del Japan Journal, es. /japan#kyoto */
export function cityPath(slug: string) {
  return `${japanPath}#${slug}`
}
