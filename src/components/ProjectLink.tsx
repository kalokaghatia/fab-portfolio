import type { ReactNode } from 'react'
import { PageLink } from '@/components/PageLink'
import { projectPath } from '@/lib/router'

interface ProjectLinkProps {
  slug: string
  className?: string
  'aria-label'?: string
  children: ReactNode
}

/** Link alla pagina di un progetto. */
export function ProjectLink({ slug, ...rest }: ProjectLinkProps) {
  return <PageLink to={projectPath(slug)} {...rest} />
}
