import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { projects } from '@/content/site'
import { SelectedWork } from '@/sections/SelectedWork'

describe('SelectedWork', () => {
  test('mostra tutti i progetti e filtra per categoria', async () => {
    const user = userEvent.setup()
    render(<SelectedWork />)

    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(projects.length)

    await user.click(screen.getByRole('button', { name: 'Photography' }))

    const expected = projects.filter((p) => p.category === 'Photography').length
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(expected)
    expect(screen.getByRole('button', { name: 'Photography' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
