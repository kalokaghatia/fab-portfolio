import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { transition } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Fa emergere il contenuto dal basso, mascherato, quando entra nel viewport.
 * L'osservatore sta sul contenitore visibile (non sul testo nascosto dalla maschera),
 * e lo stato passa al figlio tramite le variants.
 * Con "riduci movimento" attivo, MotionConfig lo riduce a una dissolvenza.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.span
      className={`block pb-[0.08em] [clip-path:inset(0_-0.5em_0_-0.5em)] ${className ?? ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: '105%' }, visible: { y: 0 } }}
        transition={{ ...transition.base, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/** Dissolvenza con leggero spostamento, per immagini e blocchi. */
export function FadeIn({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ ...transition.base, delay }}
    >
      {children}
    </motion.div>
  )
}
