import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import App from '@/App'
import { projects, site } from '@/content/site'
import type { Project } from '@/types/content'

// La pagina del progetto precedente resta montata finché la sua animazione d'uscita (0.8s) non finisce.
const exitTimeout = { timeout: 3000 }

function cardName(project: Project) {
  return `${project.title} — ${project.category}, ${project.year}`
}

describe('App', () => {
  const [first, second] = projects
  if (!first || !second) throw new Error('Servono almeno due progetti nei contenuti')

  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    document.title = 'Home'
  })

  afterEach(() => {
    document.documentElement.style.overflow = ''
  })

  test('titolo e blocco dello scroll restano corretti passando al progetto successivo', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: cardName(first) }))
    expect(document.title).toBe(`${first.title} — ${site.name}`)

    await user.click(screen.getByRole('link', { name: `Next project: ${second.title}` }))
    await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(1), exitTimeout)

    expect(screen.getByRole('dialog', { name: second.title })).toBeInTheDocument()
    expect(document.title).toBe(`${second.title} — ${site.name}`)
    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  test('Close dopo "Next project" torna alla homepage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: cardName(first) }))
    await user.click(screen.getByRole('link', { name: `Next project: ${second.title}` }))
    await waitFor(() => expect(screen.getAllByRole('dialog')).toHaveLength(1), exitTimeout)

    await user.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(window.location.pathname).toBe('/'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), exitTimeout)

    expect(document.title).toBe('Home')
    expect(document.documentElement.style.overflow).toBe('')
  })
})
