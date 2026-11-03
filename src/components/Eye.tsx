import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useId, useRef } from 'react'
import { cn } from '@/utils/cn'

interface EyeProps {
  className?: string
  /** Secondi prima del primo battito: occhi diversi sbattono le palpebre in momenti diversi. */
  delay?: number
  /** Ogni quanti secondi sbatte le palpebre. */
  every?: number
}

/**
 * Un occhio in stile emoji 👀, in bianco e nero: ovale verticale bianco e pupilla nera
 * che guarda verso il cursore. Ogni tanto sbatte le palpebre. Puramente decorativo;
 * con "riduci movimento" resta aperto e fermo.
 */
export function Eye({ className, delay = 0, every = 4 }: EyeProps) {
  const ref = useRef<SVGSVGElement>(null)
  const clipId = useId()
  // A riposo guarda di lato, come l'emoji.
  const x = useMotionValue(7)
  const y = useMotionValue(0)
  const lookX = useSpring(x, { stiffness: 180, damping: 18 })
  const lookY = useSpring(y, { stiffness: 180, damping: 18 })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const box = ref.current?.getBoundingClientRect()
      if (!box) return
      const dx = event.clientX - (box.left + box.width / 2)
      const dy = event.clientY - (box.top + box.height / 2)
      const distance = Math.hypot(dx, dy) || 1
      // Più il cursore è lontano, più la pupilla si sposta verso il bordo (fino a un massimo).
      const reach = Math.min(1, distance / 280)
      x.set((dx / distance) * 9 * reach)
      y.set((dy / distance) * 11 * reach)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])

  return (
    <svg ref={ref} viewBox="0 0 60 66" aria-hidden className={cn('block h-auto w-full', className)}>
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="30" cy="33" rx="28" ry="31" />
        </clipPath>
      </defs>
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={{ scaleY: [1, 1, 0.05, 1] }}
        transition={{
          duration: every,
          times: [0, 0.93, 0.965, 1],
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
      >
        <ellipse cx="30" cy="33" rx="28" ry="31" className="fill-paper" />
        <g clipPath={`url(#${clipId})`}>
          <motion.g style={{ x: lookX, y: lookY }}>
            <ellipse cx="30" cy="35" rx="14" ry="16" className="fill-ink" />
            <circle cx="35" cy="29" r="4" className="fill-paper" />
          </motion.g>
        </g>
      </motion.g>
    </svg>
  )
}
