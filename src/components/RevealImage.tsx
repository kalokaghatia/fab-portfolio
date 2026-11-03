import { motion, useReducedMotion } from 'motion/react'
import { MediaFrame } from '@/components/MediaFrame'
import { ease } from '@/lib/motion'
import type { Media } from '@/types/content'
import { cn } from '@/utils/cn'

interface RevealImageProps {
  media: Media
  index?: number
  /** Classi del riquadro: con `fill` è il riquadro a decidere le proporzioni. */
  className?: string
  fill?: boolean
  delay?: number
}

/**
 * Transizione d'ingresso editoriale: il riquadro si apre dal basso come una tenda
 * mentre la foto rientra da un leggero zoom. Al passaggio del mouse la foto si avvicina.
 * Con "riduci movimento" la foto compare subito, senza animazioni.
 */
export function RevealImage({ media, index, className, fill, delay = 0 }: RevealImageProps) {
  const reduceMotion = useReducedMotion()
  const skip = reduceMotion ? false : undefined

  return (
    <motion.div
      className={cn('group relative overflow-hidden', className)}
      initial={skip ?? { clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.2, ease, delay }}
    >
      <motion.div
        className={cn(fill && 'size-full')}
        initial={skip ?? { scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.8, ease, delay }}
      >
        <div
          className={cn(
            'transition-transform duration-[1.2s] ease-editorial group-hover:scale-[1.04]',
            fill && 'size-full',
          )}
        >
          <MediaFrame media={media} index={index} fill={fill} className={cn(fill && 'size-full')} />
        </div>
      </motion.div>
    </motion.div>
  )
}
