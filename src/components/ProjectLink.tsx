import type { MouseEvent, ReactNode } from 'react'
import { navigate, projectPath } from '@/lib/router'

interface ProjectLinkProps {
  slug: string
  className?: string
  'aria-label'?: string
  children: ReactNode
}

/**
 * Link alla pagina di un progetto. Il click normale apre la pagina senza ricaricare;
 * Cmd/Ctrl+click o il tasto centrale aprono comunque una nuova scheda.
 */
export function ProjectLink({ slug, className, children, ...rest }: ProjectLinkProps) {
  const href = projectPath(slug)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    navigate(href, { fromSite: true })
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  )
}
