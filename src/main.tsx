import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root non trovato in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
