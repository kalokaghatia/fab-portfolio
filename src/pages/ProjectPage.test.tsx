import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { projects } from '@/content/site'
import { ProjectPage } from '@/pages/ProjectPage'

describe('ProjectPage', () => {
  const project = projects[0]

  test('mostra titolo, tutte le immagini e il progetto successivo', () => {
    if (!project) throw new Error('Nessun progetto nei contenuti')
    render(<ProjectPage project={project} />)

    expect(screen.getByRole('dialog', { name: project.title })).toBeInTheDocument()

    const expectedImages = 1 + (project.gallery?.length ?? 0)
    expect(screen.getAllByRole('img')).toHaveLength(expectedImages)

    const next = projects[1]
    if (next) {
      expect(screen.getByRole('link', { name: `Next project: ${next.title}` })).toHaveAttribute(
        'href',
        `/work/${next.slug}`,
      )
    }
  })
})
