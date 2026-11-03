import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { foodColumn } from '@/content/site'
import { FoodColumn } from '@/sections/FoodColumn'

describe('FoodColumn', () => {
  test('mostra il titolo, la frase e il link a @lefoodgirls', () => {
    render(<FoodColumn />)

    expect(screen.getByRole('heading', { name: /Eat\s*with\s*your eyes/ })).toBeInTheDocument()
    expect(screen.getByText(foodColumn.statement)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Follow @lefoodgirls/ })).toHaveAttribute(
      'href',
      foodColumn.instagram.href,
    )
  })
})
