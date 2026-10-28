import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { navigation, site } from '@/content/site'
import { ease, transition } from '@/lib/motion'

/**
 * Header fisso in mix-blend-difference: resta leggibile sia sulle sezioni
 * bianche sia su quelle nere senza cambiare colore via JavaScript.
 *
 * Il colore dichiarato è ink, invertito dal filtro prima della fusione: a schermo è
 * come il bianco in difference, ma gli strumenti di accessibilità (che non calcolano
 * le fusioni) leggono il contrasto reale, testo scuro su paper. In "contrasto elevato"
 * di sistema filtro e fusione si spengono e restano i colori forzati.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  // Chiudendo con Close o Esc il focus torna su "Menu"; con un link resta sulla sezione scelta.
  const returnFocus = useRef(false)

  const closeMenu = () => {
    returnFocus.current = true
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      returnFocus.current = true
      setOpen(false)
    }
    // Con il menu aperto il resto della pagina non è raggiungibile da tastiera, mouse e screen reader.
    const menu = menuRef.current
    const menuButton = menuButtonRef.current
    const background = [...(menu?.parentElement?.children ?? [])].filter(
      (element): element is HTMLElement => element !== menu && element instanceof HTMLElement,
    )
    for (const element of background) element.inert = true
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      for (const element of background) element.inert = false
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      if (returnFocus.current) menuButton?.focus()
      returnFocus.current = false
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-page pt-4 text-ink invert mix-blend-difference md:pt-5 forced-colors:filter-none forced-colors:mix-blend-normal">
        <div className="grid-page items-start">
          <a
            href="#top"
            className="col-span-2 text-xl leading-none font-extrabold tracking-[-0.05em]"
          >
            {site.name}
          </a>

          <nav aria-label="Main" className="hidden lg:col-span-6 lg:col-start-5 lg:block">
            <ul className="flex justify-between label">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="group relative inline-block">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-editorial group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="hidden text-right label lg:col-span-2 lg:col-start-11 lg:block">
            Portfolio — ©{site.year}
          </p>

          <button
            ref={menuButtonRef}
            type="button"
            className="col-span-2 col-start-3 justify-self-end label md:col-start-5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-ink px-page pt-4 pb-6 text-paper lg:hidden"
            // Con "riduci movimento" il menu compare in dissolvenza invece di scendere come una tenda.
            initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex items-start justify-between">
              <span className="text-xl leading-none font-extrabold tracking-[-0.05em]">
                {site.name}
              </span>
              <button type="button" className="label" onClick={closeMenu} autoFocus>
                Close
              </button>
            </div>

            <nav aria-label="Main" className="mt-auto">
              <ul>
                {navigation.map((item, i) => (
                  <li key={item.href} className="overflow-hidden border-t border-grey-700">
                    <motion.a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-2 text-[clamp(2.5rem,12vw,5rem)] leading-[0.95] font-semibold tracking-[-0.05em]"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ ...transition.base, delay: 0.25 + i * 0.05 }}
                    >
                      {item.label}
                      <span className="label text-grey-400">{String(i + 1).padStart(2, '0')}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
