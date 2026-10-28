import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { MediaFrame } from '@/components/MediaFrame'
import { Wordmark } from '@/components/Wordmark'
import { heroPhotos, site } from '@/content/site'
import { useFinePointer } from '@/hooks/useFinePointer'
import { ease, transition } from '@/lib/motion'

/* Leggera rotazione e scarto di ogni foto nella pila, come stampe appoggiate. */
const stackOffsets = [
  { rotate: -4, x: -18, y: 10 },
  { rotate: 3, x: 14, y: -6 },
  { rotate: -1.5, x: 6, y: 14 },
  { rotate: 5, x: -10, y: -12 },
  { rotate: -3, x: 20, y: 4 },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const finePointer = useFinePointer()
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const count = heroPhotos.length

  // Desktop: la foto in primo piano cambia con la posizione orizzontale del mouse,
  // e la pila segue il cursore con un ritardo morbido.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const followX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.6 })
  const followY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.6 })

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!finePointer) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    setActive(Math.min(count - 1, Math.max(0, Math.floor(ratio * count))))
    if (!reduceMotion) {
      pointerX.set((ratio - 0.5) * 80)
      pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 50)
    }
  }

  // Touch: scorrimento automatico, disattivato con "riduci movimento".
  useEffect(() => {
    if (finePointer || reduceMotion) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), 2600)
    return () => window.clearInterval(id)
  }, [finePointer, reduceMotion, count])

  // Allo scroll la tipografia si alza e la pila si allontana (non con "riduci movimento").
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const typeY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const stackY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative flex min-h-svh flex-col overflow-hidden bg-paper px-page pt-24 pb-5 md:pt-28"
      aria-label="FAB. — Content Creator & Graphic Designer"
    >
      <div className="grid-page relative z-20 items-start">
        <motion.p
          className="col-span-4 text-lead leading-[0.95] font-semibold uppercase md:col-span-3 lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition.base, delay: 0.7 }}
        >
          {site.role[0]}
          <br />
          {site.role[1]}
        </motion.p>
        <motion.p
          className="col-span-2 mt-6 label text-grey-600 md:col-start-5 md:mt-1 lg:col-span-2 lg:col-start-9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.base, delay: 0.9 }}
        >
          Selected work,
          <br />
          photography
          <br />& a Japan journal
        </motion.p>
        <motion.p
          className="col-span-2 mt-6 text-right label text-grey-600 md:col-span-1 md:mt-1 lg:col-span-2 lg:col-start-11"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.base, delay: 1 }}
        >
          Index
          <br />
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </motion.p>
      </div>

      {/* Pila di fotografie in primo piano, sulla B di "FAB.", spostata verso destra (80% su tablet/desktop) */}
      <motion.div
        className="pointer-events-none absolute top-[44%] left-[72.5%] z-20 md:left-[80%] w-[clamp(9rem,20vw,18rem)] -translate-x-1/2 -translate-y-1/2 lg:top-1/2"
        style={{ x: followX, y: followY }}
      >
        <motion.div style={{ y: reduceMotion ? 0 : stackY }} className="relative">
          {heroPhotos.map((photo, i) => {
            const offset = stackOffsets[i % stackOffsets.length] ?? { rotate: 0, x: 0, y: 0 }
            const depth = (i - active + count) % count
            const isActive = depth === 0
            return (
              <motion.div
                key={photo.alt}
                className="absolute inset-0 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] first:relative"
                style={{ zIndex: count - depth }}
                initial={{ opacity: 0, y: 120, rotate: 0 }}
                animate={{
                  opacity: depth > 2 ? 0 : 1,
                  y: isActive ? 0 : offset.y + depth * 6,
                  x: isActive ? 0 : offset.x,
                  rotate: isActive ? 0 : offset.rotate,
                  scale: 1 - depth * 0.04,
                }}
                transition={{ duration: 0.8, ease, delay: i * 0.06 + 0.2 }}
              >
                <MediaFrame media={photo} index={i + 1} loading={i === 0 ? 'eager' : 'lazy'} />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Logo tipografico a tutta larghezza */}
      <motion.div style={{ y: reduceMotion ? 0 : typeY }} className="relative z-10 mt-auto">
        <Wordmark as="h1" animated />
      </motion.div>
    </section>
  )
}
