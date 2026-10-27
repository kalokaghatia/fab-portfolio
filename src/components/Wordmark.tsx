import { motion } from 'motion/react'
import { site } from '@/content/site'
import { ease } from '@/lib/motion'

/*
 * Il logo "FAB." occupa esattamente la larghezza del contenitore.
 * Misure di Inter Tight 800 con tracking −0.03em (A e B non si toccano): l'inchiostro di "FAB." è largo
 * 2.06em (misurato nel browser) e parte 0.041em a destra dell'origine. Da qui 48.2cqw
 * (100 / 2.06, con un minimo margine) e il rientro di −0.041em per allineare la F al margine.
 */
const wordmarkClass =
  'flex text-[48.2cqw] leading-[0.8] font-extrabold tracking-[-0.03em] -ml-[0.041em] select-none'

/* Maschera solo verticale: in orizzontale le lettere non vengono mai tagliate. */
const verticalMask = '[clip-path:inset(0_-0.5em_0_-0.5em)]'

interface WordmarkProps {
  as?: 'h1' | 'p'
  animated?: boolean
}

export function Wordmark({ as = 'p', animated = false }: WordmarkProps) {
  const Tag = as
  const letters = site.name.split('')

  return (
    <div className="@container">
      <Tag className={wordmarkClass} aria-label={site.name}>
        {letters.map((letter, i) => (
          <span key={`${letter}-${i}`} aria-hidden className={`block ${verticalMask}`}>
            {animated ? (
              <motion.span
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.1 + i * 0.08 }}
              >
                {letter}
              </motion.span>
            ) : (
              letter
            )}
          </span>
        ))}
      </Tag>
    </div>
  )
}
