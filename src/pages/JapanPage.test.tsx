import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { japanJournal } from '@/content/site'
import { JapanPage } from '@/pages/JapanPage'

describe('JapanPage', () => {
  test('mostra un capitolo per città, "Stay tuned" (senza capitolo Food)', () => {
    render(<JapanPage />)

    expect(screen.getByRole('dialog', { name: /Japan\s*Journal/ })).toBeInTheDocument()

    for (const city of japanJournal.cities) {
      expect(screen.getByRole('heading', { level: 2, name: city.name })).toBeInTheDocument()
    }
    expect(screen.queryByRole('heading', { level: 2, name: 'Food' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Stay\s*tuned/ })).toBeInTheDocument()
  })
})
