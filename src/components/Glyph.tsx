import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'
import { cn } from '@/utils/cn'

/** Asterisco a otto bracci (come ✳), disegnato come le icone di Lucide. */
function Asterisk8(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      {...props}
    >
      <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64 5.64 18.36" />
    </svg>
  )
}

const glyphs = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  asterisk: Asterisk8,
  check: Check,
  close: X,
} satisfies Record<string, LucideIcon | typeof Asterisk8>

interface GlyphProps {
  name: keyof typeof glyphs
  className?: string
  /** Spessore del tratto su una griglia di 24: più basso per i simboli grandi e leggeri. */
  strokeWidth?: number
}

/**
 * Simbolo tipografico (frecce, asterisco, chiudi) disegnato in SVG. Inter Tight non ha
 * questi caratteri: come testo ogni sistema li prenderebbe da un altro font, e Safari
 * mostrerebbe ✳ come emoji. Misura 1em e usa il colore del testo, come un carattere.
 */
export function Glyph({ name, className, strokeWidth = 1.75 }: GlyphProps) {
  const Icon = glyphs[name]
  return (
    <Icon
      aria-hidden
      focusable="false"
      strokeWidth={strokeWidth}
      className={cn('inline-block size-[1em] shrink-0 align-[-0.125em]', className)}
    />
  )
}
