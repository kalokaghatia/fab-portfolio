import { motion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { MediaFrame } from '@/components/MediaFrame'
import { Reveal } from '@/components/Reveal'
import { frames } from '@/content/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { Frame } from '@/types/content'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function ThroughMyEyes() {
  const desktop = useMediaQuery('(min-width: 48rem)')

  return (
    <section
      id="photography"
      className="overflow-x-clip bg-ink py-section text-paper"
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
        <p className="col-span-4 label text-grey-400 md:col-span-6 lg:col-span-3 lg:text-right">
          {pad(frames.length)} frames
          <br />
          Everyday moments
        </p>
      </div>

      {desktop ? <ScrollStrip /> : <SwipeStrip />}
    </section>
  )
}

/** Uno scatto: tutti nello stesso formato verticale, con numero e frase sotto. */
function FrameCard({ frame, index }: { frame: Frame; index: number }) {
  return (
    <figure>
      <MediaFrame
        media={{ ...frame.photo, aspect: 'portrait' }}
        index={index + 1}
        // Nastro a scorrimento da 768px in su, card da sfogliare col dito sotto
        sizes="(min-width: 48rem) min(24vw, 52vh), 72vw"
      />
      <figcaption className="mt-4 flex items-baseline gap-3">
        <span className="label text-grey-500">{pad(index + 1)}</span>
        <span className="text-lead leading-tight font-medium">{frame.caption}</span>
      </figcaption>
    </figure>
  )
}

/**
 * Computer: il nastro si aggancia allo schermo e, scendendo con la pagina, si sposta
 * verso sinistra, dal primo scatto all'ultimo. La corsa è misurata sul nastro reale,
 * così tutte le foto passano davanti agli occhi prima di proseguire.
 */
function ScrollStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  return (
    <div ref={ref} className="relative" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.ul ref={trackRef} style={{ x }} className="flex w-max gap-6 px-[8vw]">
          {frames.map((frame, i) => (
            <li key={frame.photo.alt} className="w-[min(24vw,52vh)] shrink-0">
              <FrameCard frame={frame} index={i} />
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

/** Telefono: nastro da scorrere con il dito, una foto alla volta con aggancio morbido. */
function SwipeStrip() {
  return (
    <ul className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-page pb-2 [scrollbar-width:none]">
      {frames.map((frame, i) => (
        <li key={frame.photo.alt} className="w-[72vw] shrink-0 snap-center">
          <FrameCard frame={frame} index={i} />
        </li>
      ))}
    </ul>
  )
}
