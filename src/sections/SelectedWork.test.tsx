import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { projectCategories, projects } from '@/content/site'
import { SelectedWork } from '@/sections/SelectedWork'
import { inCategory } from '@/types/content'

describe('SelectedWork', () => {
  test('mostra tutti i progetti e filtra per categoria', async () => {
    const user = userEvent.setup()
    render(<SelectedWork />)

    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(projects.length)

    // Categoria presa dai contenuti reali, così il test non dipende dai progetti inseriti.
    const category = projects[0]?.category
    if (!category) throw new Error('Nessun progetto nei contenuti')
    await user.click(screen.getByRole('button', { name: category }))

    const expected = projects.filter((p) => inCategory(p, category)).length
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(expected)
    expect(screen.getByRole('button', { name: category })).toHaveAttribute('aria-pressed', 'true')
  })

  test('mostra un messaggio per le categorie senza progetti', async () => {
    const user = userEvent.setup()
    render(<SelectedWork />)

    const empty = projectCategories.find(
      (c) => c !== 'All' && !projects.some((p) => inCategory(p, c)),
    )
    if (!empty) return
    await user.click(screen.getByRole('button', { name: empty }))

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.getByText('No projects in this category yet.')).toBeInTheDocument()
  })
})
