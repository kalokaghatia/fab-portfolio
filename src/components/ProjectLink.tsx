import type { MouseEvent, ReactNode } from 'react'
import { navigate, projectPath, type RouteState } from '@/lib/router'

interface ProjectLinkProps {
  slug: string
  /**
   * Sostituisce la pagina corrente nella cronologia invece di aggiungerne una
   * (es. "Next project"): così "Close" torna sempre dove si era prima del primo progetto.
   */
  replace?: boolean
  className?: string
  'aria-label'?: string
  children: ReactNode
}

/**
 * Link alla pagina di un progetto. Il click normale apre la pagina senza ricaricare;
 * Cmd/Ctrl+click o il tasto centrale aprono comunque una nuova scheda.
 */
export function ProjectLink({
  slug,
  replace = false,
  className,
  children,
  ...rest
}: ProjectLinkProps) {
  const href = projectPath(slug)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    // Sostituendo, si eredita da dove era stata aperta la pagina corrente (dal sito o da link diretto).
    const state = replace ? ((window.history.state as RouteState | null) ?? {}) : { fromSite: true }
    navigate(href, state, { replace })
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  )
}
