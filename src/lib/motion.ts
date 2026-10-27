import type { Transition } from 'motion/react'

/** Curva e durate condivise: movimenti lenti, decisi, mai rimbalzanti. */
export const ease = [0.22, 1, 0.36, 1] as const

export const transition = {
  base: { duration: 0.9, ease },
  fast: { duration: 0.5, ease },
} satisfies Record<string, Transition>
