import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { MediaFrame } from '@/components/MediaFrame'
import { Reveal } from '@/components/Reveal'
import { photoCollections } from '@/content/site'
import { cn } from '@/utils/cn'

const widthByAspect = {
  portrait: 'w-[62vw] md:w-[28vw]',
  landscape: 'w-[80vw] md:w-[40vw]',
  square: 'w-[66vw] md:w-[30vw]',
  tall: 'w-[56vw] md:w-[24vw]',
  slim: 'w-[50vw] md:w-[21vw]',
} as const

export function ThroughMyEyes() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Il nastro di foto scorre in orizzontale mentre la pagina scorre in verticale.
  // Con "riduci movimento" resta fermo e si sfoglia di lato, come una normale lista scorrevole.
  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-42%'])

  return (
    <section
      id="photography"
      ref={ref}
      className="overflow-hidden bg-ink py-section text-paper"
      aria-labelledby="photography-title"
    >
      <div className="grid-page items-end gap-y-8 px-page">
        <p className="col-span-4 label text-grey-400 md:col-span-2">(03) Photography</p>
        <h2
          id="photography-title"
          className="col-span-4 text-title font-bold uppercase md:col-span-4 lg:col-span-7 lg:col-start-3"
        >
          <Reveal>Through</Reveal>
          <Reveal delay={0.08}>My Eyes</Reveal>
        </h2>
        <ul className="col-span-4 flex flex-wrap gap-x-4 gap-y-1 label text-grey-400 md:col-span-6 lg:col-span-3 lg:flex-col lg:items-end">
          {photoCollections.map((c) => (
            <li key={c.slug}>{c.title}</li>
          ))}
        </ul>
      </div>

      <motion.ul
        style={reduceMotion ? undefined : { x }}
        className={cn(
          'mt-14 flex items-end gap-4 pl-[8vw] md:mt-24 md:gap-6',
          reduceMotion && 'overflow-x-auto pr-[8vw]',
        )}
      >
        {photoCollections.map((collection, i) => (
          <li
            key={collection.slug}
            className={cn('shrink-0', widthByAspect[collection.cover.aspect])}
          >
            <MediaFrame media={collection.cover} index={i + 1} />
            <p className="mt-3 flex justify-between label">
              <span>{collection.title}</span>
              <span className="text-grey-400">Collection {String(i + 1).padStart(2, '0')}</span>
            </p>
          </li>
        ))}
      </motion.ul>
    </section>
  )
}
