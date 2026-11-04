import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { MediaFrame } from '@/components/MediaFrame'
import { Overlay } from '@/components/Overlay'
import { FadeIn, Reveal } from '@/components/Reveal'
import { RevealImage } from '@/components/RevealImage'
import { japanJournal, site } from '@/content/site'
import { ease } from '@/lib/motion'
import type { JapanCity } from '@/types/content'
import { cn } from '@/utils/cn'

/* Le tappe del viaggio, nell'ordine delle città. */
const stops = [...japanJournal.cities.map((city) => ({ id: city.slug, name: city.name }))]

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function scrollToStop(id: string) {
  document.getElementById(`japan-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Japan Journal raccontato come un viaggio: una linea di percorso fissa in alto
 * segna la tappa in cui ti trovi, e ogni città passa il testimone alla successiva
 * con un tratto che si disegna ("Next stop"). In chiusura il cibo e "Stay tuned".
 */
export function JapanPage() {
  const { cities } = japanJournal
  // -1 = sei ancora all'inizio, prima della prima tappa.
  const [active, setActive] = useState(-1)

  // Aperta da una città (es. /japan#kyoto): scende direttamente a quella tappa.
  useEffect(() => {
    const slug = window.location.hash.slice(1)
    if (!slug) return
    const id = window.setTimeout(() => {
      document.getElementById(`japan-${slug}`)?.scrollIntoView({ block: 'start' })
    }, 500)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const sections = ['start', ...stops.map((stop) => stop.id)]
      .map((id) => document.getElementById(`japan-${id}`))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(sections.indexOf(entry.target as HTMLElement) - 1)
        }
      },
      // Conta come "tappa attuale" la sezione che attraversa la fascia centrale dello schermo.
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <Overlay
      title={`Japan Journal — ${site.name}`}
      labelledBy="japan-page-title"
      toolbar={<RouteBar active={active} />}
    >
      <article className="px-page pb-section">
        <header id="japan-start" className="mt-6 border-t border-ink pt-4">
          <div className="flex items-baseline justify-between label">
            <span>Journal — Vol. 01</span>
            <span className="text-grey-500">
              {pad(cities.length)} cities · {pad(stops.length)} stops
            </span>
          </div>
          <div className="mt-10 flex items-end justify-between gap-6 md:mt-16">
            <h1 id="japan-page-title" className="text-display font-extrabold uppercase">
              <Reveal delay={0.4}>Japan</Reveal>
              <Reveal delay={0.5}>Journal</Reveal>
            </h1>
            <p lang="ja" aria-hidden className="font-jp text-title leading-none font-bold">
              日本
            </p>
          </div>

          <div className="mt-10 grid-page items-end gap-y-10 md:mt-14">
            <FadeIn
              delay={0.5}
              className="col-span-4 max-w-[30ch] text-lead font-medium md:col-span-3 lg:col-span-5"
            >
              {japanJournal.intro}
            </FadeIn>
            {/* L'itinerario scritto per intero, come su un biglietto */}
            <FadeIn delay={0.6} className="col-span-4 md:col-span-3 lg:col-span-6 lg:col-start-7">
              <p className="label text-grey-500">Itinerary</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 text-[clamp(1.5rem,1rem+2vw,3rem)] leading-none font-extrabold tracking-[-0.04em] uppercase">
                {cities.map((city, i) => (
                  <span key={city.slug} className="flex items-baseline gap-x-3">
                    {city.name}
                    {i < cities.length - 1 && (
                      <span aria-hidden className="font-light text-grey-400">
                        →
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </FadeIn>
          </div>
        </header>

        <NextStop from="Start" to={cities[0]?.name ?? ''} />

        {cities.map((city, i) => (
          <div key={city.slug}>
            <CityStop city={city} index={i} />
            {stops[i + 1] && <NextStop from={city.name} to={stops[i + 1]?.name ?? ''} />}
          </div>
        ))}
      </article>

      <StayTuned />
    </Overlay>
  )
}

/** Linea del percorso, fissa sotto la barra in alto: le tappe si riempiono man mano. */
function RouteBar({ active }: { active: number }) {
  return (
    <nav aria-label="Journey" className="border-b border-grey-200 px-page pb-3">
      <ol className="flex items-center">
        {stops.map((stop, i) => (
          <li key={stop.id} className={cn('flex items-center', i < stops.length - 1 && 'flex-1')}>
            <button
              type="button"
              onClick={() => scrollToStop(stop.id)}
              aria-current={i === active ? 'step' : undefined}
              className="group flex items-center gap-2 label"
            >
              <span
                aria-hidden
                className={cn(
                  'size-2.5 rounded-full border border-ink transition-colors duration-500',
                  i <= active ? 'bg-ink' : 'bg-paper',
                  i === active && 'ring-4 ring-ink/10',
                )}
              />
              <span
                className={cn(
                  'transition-colors duration-500 group-hover:text-ink',
                  // Sul telefono, con molte tappe, si legge solo il nome di quella attuale.
                  i === active ? 'text-ink' : 'text-grey-400 max-md:sr-only',
                )}
              >
                {stop.name}
              </span>
            </button>
            {i < stops.length - 1 && (
              <span aria-hidden className="relative mx-2 h-px flex-1 bg-grey-200 md:mx-4">
                <span
                  className={cn(
                    'absolute inset-0 origin-left bg-ink transition-transform duration-700 ease-editorial',
                    i < active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Il passaggio da una tappa all'altra: un tratto tratteggiato che si disegna. */
function NextStop({ from, to }: { from: string; to: string }) {
  return (
    <div aria-hidden className="my-10 flex items-center gap-3 label md:my-14 md:gap-5">
      <span className="text-grey-500">{from}</span>
      <motion.span
        className="h-0 flex-1 origin-left border-t border-dashed border-ink"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.6, ease }}
      />
      <span className="text-grey-500">Next stop</span>
      <span>{to} →</span>
    </div>
  )
}

/* Ogni tappa mostra almeno quattro riquadri: quelli senza foto restano in attesa dei nuovi scatti. */
const MIN_PHOTOS = 4
const waitingTones = [2, 3, 1, 4] as const

/**
 * Una tappa, compatta: in testa nome, kanji, la riga che la racconta e le coordinate,
 * poi una griglia di foto della stessa misura (quattro per riga su computer, due sul telefono).
 */
function CityStop({ city, index }: { city: JapanCity; index: number }) {
  const headingId = `japan-${city.slug}-title`
  const waiting = Math.max(0, MIN_PHOTOS - city.photos.length)

  return (
    <section id={`japan-${city.slug}`} aria-labelledby={headingId} className="scroll-mt-28">
      <div className="flex items-baseline justify-between border-t border-ink pt-3 label">
        <span>
          Stop {pad(index + 1)} / {pad(stops.length)}
        </span>
        <span className="text-grey-500">{city.coordinates}</span>
      </div>

      <div className="mt-5 grid-page items-end gap-y-4 md:mt-6">
        <h2
          id={headingId}
          className="col-span-3 text-title font-extrabold uppercase md:col-span-3 lg:col-span-5"
        >
          <Reveal>{city.name}</Reveal>
        </h2>
        <p
          lang="ja"
          aria-hidden
          className="col-span-1 justify-self-end font-jp text-[clamp(1.75rem,1rem+2.4vw,3.5rem)] leading-none font-bold md:justify-self-start lg:col-span-2"
        >
          {city.kanji}
        </p>
        <p className="col-span-4 max-w-[30ch] text-lead font-medium md:col-span-2 lg:col-span-5 lg:justify-self-end lg:text-right">
          {city.note}
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-4 md:gap-4">
        {city.photos.map((photo, i) => (
          <li key={`${photo.alt}-${i}`}>
            <RevealImage
              media={photo}
              fill
              delay={0.06 * i}
              sizes="(min-width: 48rem) 25vw, 50vw"
              className="aspect-[4/5]"
            />
          </li>
        ))}
        {Array.from({ length: waiting }, (_, i) => (
          <li key={`waiting-${i}`}>
            <MediaFrame
              media={{
                alt: `[${city.name} — photo to come]`,
                aspect: 'portrait',
                tone: waitingTones[i % waitingTones.length],
              }}
              index={city.photos.length + i + 1}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Chiusura su fondo nero: il prossimo viaggio è in arrivo. */
function StayTuned() {
  return (
    <section
      aria-labelledby="stay-tuned-title"
      className="bg-ink px-page pt-section pb-16 text-paper"
    >
      <div className="flex items-center justify-between border-b border-paper/30 pb-3 label">
        <span>Next chapter</span>
        <span className="flex items-center gap-2 text-grey-400">
          <span aria-hidden className="size-2 rounded-full bg-paper motion-safe:animate-pulse" />
          In progress
        </span>
      </div>
      <h2 id="stay-tuned-title" className="mt-10 text-display font-extrabold uppercase md:mt-16">
        <Reveal>Stay</Reveal>
        <Reveal delay={0.08}>tuned.</Reveal>
      </h2>
      <FadeIn className="mt-10 flex items-end justify-between gap-6">
        <p className="max-w-[28ch] text-lead font-medium text-grey-300">{japanJournal.stayTuned}</p>
        <p lang="ja" aria-hidden className="font-jp text-title leading-none font-bold">
          続く
        </p>
      </FadeIn>
    </section>
  )
}
