import { motion } from 'motion/react'
import { useId } from 'react'
import { Eye } from '@/components/Eye'
import { MediaFrame } from '@/components/MediaFrame'
import { FadeIn, Reveal } from '@/components/Reveal'
import { foodColumn } from '@/content/site'
import type { Media } from '@/types/content'
import { cn } from '@/utils/cn'

/**
 * "Eat with your eyes": la rubrica sul cibo, su fondo nero. Titolo su una riga con un occhio
 * al posto della O che sbatte le palpebre e segue il cursore,
 * il badge rotante di @lefoodgirlss e le foto su due nastri che scorrono all'infinito.
 */
export function FoodColumn() {
  const half = Math.ceil(foodColumn.photos.length / 2)

  return (
    <section
      id="food"
      className="overflow-x-clip bg-ink pt-section pb-12 text-paper md:pb-16"
      aria-labelledby="food-title"
    >
      <div className="px-page">
        <div className="flex items-baseline justify-between border-b border-paper/20 pb-3 label">
          <span>(05) Food</span>
          <span className="text-grey-400">A column by Fab</span>
        </div>

        {/* Una riga sola: la dimensione segue la larghezza dello schermo */}
        <h2
          id="food-title"
          aria-label="Eat with your eyes."
          className="mt-10 text-[8.1vw] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap uppercase md:mt-14"
        >
          <Reveal>
            <span aria-hidden>
              Eat with y{/* L'occhio ovale prende il posto della O */}
              <span className="mx-[0.02em] inline-block w-[0.68em] align-[-0.04em]">
                <Eye delay={0.6} every={3.4} />
              </span>
              ur eyes.
            </span>
          </Reveal>
        </h2>

        <div className="mt-16 grid-page items-end gap-y-10 md:mt-24">
          <p lang="ja" aria-hidden className="col-span-1 font-jp text-title leading-none font-bold">
            食
          </p>
          <div className="col-span-3 md:col-span-3 lg:col-span-6 lg:col-start-3">
            {foodColumn.intro.map((paragraph, i) => (
              <FadeIn
                key={paragraph}
                delay={0.1 * i}
                className={
                  i === 0
                    ? 'text-lead font-semibold'
                    : 'mt-6 max-w-[48ch] text-body text-grey-300 md:text-[1.0625rem]'
                }
              >
                {paragraph}
              </FadeIn>
            ))}
          </div>
          <InstagramBadge />
        </div>

        {/* La frase-manifesto, poi le foto parlano da sole */}
        <div className="mt-20 flex flex-col gap-4 border-t border-paper/20 pt-6 md:mt-28 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[18ch] text-[clamp(2rem,1rem+3.6vw,4.75rem)] leading-[0.95] font-bold tracking-[-0.045em]">
            <Reveal>{foodColumn.statement}</Reveal>
          </p>
          <FadeIn delay={0.2} className="label text-grey-400 md:text-right">
            {foodColumn.aside}
          </FadeIn>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 md:mt-16 md:gap-6">
        <Reel photos={foodColumn.photos.slice(0, half)} />
        <Reel photos={foodColumn.photos.slice(half)} reverse start={half} />
      </div>

      <FadeIn className="mt-8 px-page label text-grey-400">More plates, every week</FadeIn>
    </section>
  )
}

/** Badge circolare con il nome della pagina che gira piano; al centro il logo di Instagram. */
function InstagramBadge() {
  const { handle, href } = foodColumn.instagram
  const text = `follow ${handle} · asian food · `

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Follow ${handle} on Instagram`}
      className="group relative col-span-2 col-start-3 aspect-square w-full max-w-44 justify-self-end md:col-span-2 md:col-start-5 lg:col-span-3 lg:col-start-10 lg:max-w-52"
    >
      <motion.svg
        viewBox="0 0 200 200"
        aria-hidden
        className="absolute inset-0 size-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
      >
        <defs>
          <path id="food-badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-pink text-[15px] font-semibold tracking-[0.18em] uppercase">
          {/* textLength: la frase occupa esattamente un giro del cerchio (2π × 78) */}
          <textPath href="#food-badge-circle" textLength="488" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <span className="absolute inset-[24%] flex flex-col items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 ease-editorial group-hover:scale-110">
        <InstagramLogo className="w-[46%] transition-transform duration-500 ease-editorial group-hover:-rotate-6" />
      </span>
    </a>
  )
}

/**
 * Logo di Instagram a colori: quadrato con la sfumatura del marchio e fotocamera bianca,
 * così il badge si riconosce al primo sguardo.
 */
function InstagramLogo({ className }: { className?: string }) {
  // id univoco: il gradiente non si confonde con altri SVG della pagina
  const gradient = useId()

  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className}>
      <defs>
        <radialGradient id={gradient} cx="0.3" cy="1.07" r="1.25">
          <stop offset="0" stopColor="#ffd600" />
          <stop offset="0.25" stopColor="#ff7a00" />
          <stop offset="0.5" stopColor="#ff0069" />
          <stop offset="0.75" stopColor="#d300c5" />
          <stop offset="1" stopColor="#7638fa" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6.5" fill={`url(#${gradient})`} />
      <g fill="none" stroke="#fff" strokeWidth="1.6">
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.25" />
      </g>
      <circle cx="16.1" cy="7.9" r="0.95" fill="#fff" />
    </svg>
  )
}

/**
 * Un nastro di foto che scorre all'infinito (le foto sono ripetute due volte, così il giro
 * non si vede). Le stampe sono leggermente inclinate; passandoci sopra il nastro si ferma
 * e la foto si raddrizza. Con "riduci movimento" il nastro resta fermo.
 */
function Reel({
  photos,
  reverse = false,
  start = 0,
}: {
  photos: Media[]
  reverse?: boolean
  /** Numero da cui partono le didascalie "Fig.", per continuare quelle del nastro sopra. */
  start?: number
}) {
  return (
    <div className="group/reel overflow-hidden py-4">
      <ul
        className={cn(
          'flex w-max gap-4 group-hover/reel:[animation-play-state:paused] motion-reduce:animate-none md:gap-6',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
      >
        {[...photos, ...photos].map((photo, i) => (
          <li
            key={`${photo.alt}-${i}`}
            aria-hidden={i >= photos.length || undefined}
            className={cn(
              'shrink-0 transition-transform duration-700 ease-editorial hover:z-10 hover:scale-105 hover:rotate-0',
              // Stessa misura e formato verticale su entrambi i nastri
              'w-[46vw] md:w-[19vw]',
              i % 2 === 0 ? '-rotate-2' : 'rotate-2',
            )}
          >
            <MediaFrame
              media={{ ...photo, aspect: 'portrait' }}
              index={start + (i % photos.length) + 1}
              sizes="(min-width: 48rem) 19vw, 46vw"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
