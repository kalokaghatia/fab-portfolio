import { motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { Glyph } from '@/components/Glyph'
import { site } from '@/content/site'
import { ease } from '@/lib/motion'
import { navigate, type RouteState } from '@/lib/router'

interface OverlayProps {
  /** Titolo della scheda del browser mentre la pagina è aperta. */
  title: string
  /** id del titolo principale, per il nome accessibile della finestra. */
  labelledBy: string
  /** Barra facoltativa sotto quella in alto, fissa anche lei durante lo scorrimento. */
  toolbar?: ReactNode
  children: ReactNode
}

/**
 * Pagina aperta sopra la homepage come un foglio che sale, con barra in alto
 * e pulsante Close (anche con Esc). La homepage sotto resta ferma dov'era.
 */
export function Overlay({ title, labelledBy, toolbar, children }: OverlayProps) {
  // Torna sempre alla homepage: se dal sito si sono aperti più progetti uno dopo l'altro
  // ("Next project"), li chiude tutti insieme; da un link diretto apre la homepage.
  const close = () => {
    const state = window.history.state as RouteState | null
    const depth = state?.fromSite ? (state.depth ?? 1) : 0
    if (depth > 0) window.history.go(-depth)
    else navigate('/')
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.title = previousTitle
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  })

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-50 overflow-y-auto bg-paper"
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="sticky top-0 z-10 bg-paper/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-page py-4">
          <span className="text-xl leading-none font-extrabold tracking-[-0.05em]">
            {site.name}
          </span>
          <button
            type="button"
            onClick={close}
            className="group flex items-center gap-2 label"
            autoFocus
          >
            Close
            <span
              aria-hidden
              className="text-base transition-transform duration-500 ease-editorial group-hover:rotate-90"
            >
              <Glyph name="close" />
            </span>
          </button>
        </div>
        {toolbar}
      </div>

      {children}
    </motion.div>
  )
}
