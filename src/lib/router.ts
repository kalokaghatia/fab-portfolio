/*
 * Router minimo basato sulla History API: niente dipendenze, URL veri
 * (es. /work/il-viaggio-per-amarsi) e tasto Indietro del browser funzionante.
 */

export interface RouteState {
  /** true se la pagina è stata aperta da un click dentro il sito. */
  fromSite?: boolean
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
  if (to === window.location.pathname) return
  window.history.pushState(state, '', to)
  listeners.forEach((listener) => listener())
}

export function projectPath(slug: string) {
  return `/work/${slug}`
}
