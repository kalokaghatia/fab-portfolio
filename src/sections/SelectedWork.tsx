import { motion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState, type FocusEvent } from 'react'
import { MediaFrame } from '@/components/MediaFrame'
import { ProjectLink } from '@/components/ProjectLink'
import { Reveal } from '@/components/Reveal'
import { projectCategories, projects } from '@/content/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ease } from '@/lib/motion'
import type { Project, ProjectCategory } from '@/types/content'
import { cn } from '@/utils/cn'

/*
 * Composizione a collage: ogni progetto ha larghezza, formato e altezza diversi,
 * così la galleria si legge come una pagina di rivista e non come una griglia.
 * Lo schema si ripete ogni quattro progetti.
 */
const collage = [
  { width: 'w-[min(26vw,46vh)]', aspect: 'portrait', offset: '-translate-y-[7vh]', tilt: -1.5 },
  { width: 'w-[min(20vw,38vh)]', aspect: 'tall', offset: 'translate-y-[8vh]', tilt: 1.5 },
  { width: 'w-[min(34vw,64vh)]', aspect: 'landscape', offset: '-translate-y-[3vh]', tilt: -1 },
  { width: 'w-[min(24vw,46vh)]', aspect: 'square', offset: 'translate-y-[6vh]', tilt: 2 },
] as const

export function SelectedWork() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const desktop = useMediaQuery('(min-width: 48rem)')

  return (
    <section id="work" className="bg-paper py-section" aria-labelledby="work-title">
      <div className="px-page">
        <div className="grid-page items-end gap-y-8 border-t border-ink pt-4">
          <p className="col-span-4 label md:col-span-2">(02) Selected Work</p>
          <h2
            id="work-title"
            className="col-span-4 text-display font-extrabold uppercase md:col-span-6 lg:col-span-12"
          >
            <Reveal>Selected</Reveal>
            <Reveal delay={0.08} className="text-right">
              Work
            </Reveal>
          </h2>
        </div>

        <div
          className="mt-10 flex flex-wrap gap-x-5 gap-y-2 label md:mt-14"
          role="group"
          aria-label="Filtra per categoria"
        >
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
              className={cn(
                'relative transition-colors duration-300',
                filter === category ? 'text-ink' : 'text-grey-400 hover:text-ink',
              )}
            >
              {category}
              <span
                aria-hidden
                className={cn(
                  'absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-500 ease-editorial',
                  filter === category ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 px-page label text-grey-500">No projects in this category yet.</p>
      ) : desktop ? (
        <HorizontalGallery key={filter} projects={visible} />
      ) : (
        <SwipeGallery key={filter} projects={visible} />
      )}
    </section>
  )
}

/**
 * Desktop: la galleria si aggancia allo schermo e, scorrendo in verticale,
 * i progetti sfilano in orizzontale. Dietro, la parola WORK in nero scorre più lenta.
 */
function HorizontalGallery({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [distance, setDistance] = useState(0)

  // Quanto deve spostarsi il nastro: la sua larghezza meno quella dello schermo.
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [projects])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const wordX = useTransform(scrollYProgress, [0, 1], ['5%', '-35%'])

  // Tastiera: il nastro si muove solo con lo scroll verticale, quindi il Tab su una card
  // fuori schermo porta la pagina al punto in cui quella card arriva al centro.
  const handleFocus = (event: FocusEvent<HTMLUListElement>) => {
    const container = containerRef.current
    const card = event.target.closest('li')
    if (!container || !card || !event.target.matches(':focus-visible')) return
    const shift = Math.min(
      distance,
      Math.max(0, card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2),
    )
    const range = container.offsetHeight - window.innerHeight
    const top = container.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (distance > 0 ? (shift / distance) * range : 0) })
  }

  return (
    <div
      ref={containerRef}
      className="relative mt-10"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      {/* overflow-clip, non hidden: il browser non può scorrerlo di lato quando una card riceve il focus */}
      <div className="sticky top-0 flex h-svh items-center overflow-clip">
        <motion.p
          aria-hidden
          style={{ x: wordX }}
          className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[38vw] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-ink uppercase select-none"
        >
          Work — Work
        </motion.p>

        <motion.ul
          ref={trackRef}
          style={{ x }}
          onFocus={handleFocus}
          className="relative flex items-center gap-[7vw] pr-[12vw] pl-[10vw]"
        >
          {projects.map((project, i) => (
            <CollageCard key={project.slug} project={project} index={i} />
          ))}
        </motion.ul>

        {/* Barra di avanzamento */}
        <div className="absolute inset-x-0 bottom-6 flex items-center gap-4 px-page label">
          <span>Scroll</span>
          <div className="h-px flex-1 bg-grey-200">
            <motion.div className="h-full origin-left bg-ink" style={{ scaleX: scrollYProgress }} />
          </div>
          <span aria-hidden>→</span>
        </div>
      </div>
    </div>
  )
}

function CollageCard({ project, index }: { project: Project; index: number }) {
  const slot = collage[index % collage.length] ?? collage[0]

  return (
    <li className={cn('shrink-0', slot.width, slot.offset)}>
      <ProjectLink
        slug={project.slug}
        aria-label={`${project.title} — ${project.category}, ${project.year}`}
        className="group block"
      >
        <motion.div
          className={cn(
            'overflow-hidden',
            // I PNG scontornati galleggiano sulla pagina: niente ombra a riquadro.
            project.cover.fit !== 'contain' &&
              !project.cover.cutout &&
              'shadow-[0_40px_80px_-40px_rgb(0_0_0/0.35)]',
          )}
          initial={{ rotate: slot.tilt }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Foto sempre centrata nella cornice; al passaggio del mouse si avvicina appena */}
          <div className="transition-transform duration-1000 ease-editorial group-hover:scale-[1.04]">
            <MediaFrame media={{ ...project.cover, aspect: slot.aspect }} />
          </div>
        </motion.div>
        {/* Didascalia su fondo carta: leggibile anche sopra la scritta WORK nera */}
        <div className="mt-4 flex flex-col items-start gap-1">
          <span className="bg-paper px-2 py-1 text-[clamp(1.25rem,0.8rem+1.2vw,2.25rem)] leading-none font-bold tracking-[-0.04em] uppercase">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_2px]">
              {project.title}
            </span>
          </span>
          <span className="bg-paper px-2 py-1 label text-grey-500">
            {project.category} — {project.year}
          </span>
        </div>
      </ProjectLink>
    </li>
  )
}

/** Mobile: le card scorrono col dito, una alla volta, con aggancio morbido. */
function SwipeGallery({ projects }: { projects: Project[] }) {
  return (
    <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-page pb-4 [scrollbar-width:none]">
      {projects.map((project) => (
        <li key={project.slug} className="w-[78vw] shrink-0 snap-center">
          <ProjectLink
            slug={project.slug}
            aria-label={`${project.title} — ${project.category}, ${project.year}`}
            className="block"
          >
            <MediaFrame media={{ ...project.cover, aspect: 'portrait' }} />
            <p className="mt-3 text-lead leading-none font-bold tracking-[-0.04em] uppercase">
              {project.title}
            </p>
            <p className="mt-2 label text-grey-500">
              {project.category} — {project.year}
            </p>
          </ProjectLink>
        </li>
      ))}
    </ul>
  )
}
