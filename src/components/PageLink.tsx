import type { MouseEvent, ReactNode } from 'react'
import { navigate } from '@/lib/router'

interface PageLinkProps {
  to: string
  className?: string
  'aria-label'?: string
  children: ReactNode
}

/**
 * Link interno a una pagina del sito. Il click normale apre la pagina senza ricaricare;
 * Cmd/Ctrl+click o il tasto centrale aprono comunque una nuova scheda.
 */
export function PageLink({ to, className, children, ...rest }: PageLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    navigate(to, { fromSite: true })
  }

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  )
}
