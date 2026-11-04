import { motion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { MediaFrame } from '@/components/MediaFrame'
import { ProjectLink } from '@/components/ProjectLink'
import { Reveal } from '@/components/Reveal'
import { projectCategories, projects } from '@/content/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ease } from '@/lib/motion'
import { inCategory, type Project, type ProjectCategory } from '@/types/content'
import { cn } from '@/utils/cn'

/*
 * Composizione a collage: ogni progetto ha larghezza, formato e altezza diversi,
 * così la galleria si legge come una pagina di rivista e non come una griglia.
 * Lo schema si ripete ogni quattro progetti.
 */
const collage = [
  { offset: '-translate-y-[6vh]', tilt: -1.5 },
  { offset: 'translate-y-[6vh]', tilt: 1.5 },
  { offset: '-translate-y-[2vh]', tilt: -1 },
  { offset: 'translate-y-[4vh]', tilt: 2 },
] as const

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function SelectedWork() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const visible = filter === 'All' ? projects : projects.filter((p) => inCategory(p, filter))
  const desktop = useMediaQuery('(min-width: 48rem)')

  return (
    <section id="work" className="bg-paper py-section" aria-labelledby="work-title">
      <div className="px-page">
        <div className="flex items-baseline justify-between border-t border-ink pt-4 label">
          <span>(02) Selected Work</span>
          <span className="text-grey-500">{pad(projects.length)} projects</span>
        </div>

        {/*
          Titolo e filtri in un'unica composizione: "WORK" è allineato a destra e nello
          spazio libero alla sua sinistra c'è l'indice delle categorie, con il numero di progetti.
        */}
        <div className="relative z-10 mt-6 md:mt-8">
          <h2 id="work-title" className="text-display font-extrabold uppercase">
            <Reveal>Selected</Reveal>
            <Reveal delay={0.08} className="text-right">
              Work
            </Reveal>
          </h2>

          <div
            role="group"
            aria-label="Filtra per categoria"
            className="mt-8 flex flex-wrap gap-x-5 gap-y-1 md:absolute md:bottom-[0.4rem] md:left-0 md:mt-0 md:grid md:grid-cols-2 md:gap-x-8 lg:flex lg:flex-col"
          >
            {projectCategories.map((category) => {
              const count =
                category === 'All'
                  ? projects.length
                  : projects.filter((p) => inCategory(p, category)).length
              const active = filter === category
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(category)}
                  className={cn(
                    'group flex items-start text-left text-[clamp(1rem,0.85rem+0.5vw,1.375rem)] leading-tight font-semibold tracking-[-0.02em] uppercase transition-colors duration-300',
                    active ? 'text-ink' : 'text-grey-400 hover:text-ink',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'w-0 shrink-0 overflow-hidden whitespace-nowrap transition-[width] duration-500 ease-editorial',
                      active ? 'w-[1.4em]' : 'group-hover:w-[1.4em]',
                    )}
                  >
                    →
                  </span>
                  {category}
                  <span aria-hidden className="mt-[0.15em] ml-1.5 label">
                    {pad(count)}
                  </span>
                </button>
              )
            })}
          </div>
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
 * Desktop: una fila di progetti che si scorre in autonomia, senza bloccare la pagina.
 * Si può trascinare con il mouse, scorrere di lato con il trackpad, usare le frecce
 * o trascinare la barra in basso. Dietro, la parola WORK in nero scorre più lenta.
 */
function HorizontalGallery({ projects }: { projects: Project[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(1)
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 })

  const { scrollXProgress } = useScroll({ container: scrollerRef })
  const wordX = useTransform(scrollXProgress, [0, 1], ['5%', '-35%'])
  const thumbLeft = useTransform(scrollXProgress, (p) => `${p * (1 - visible) * 100}%`)

  // Quanta parte della fila è visibile: decide la larghezza del cursore della barra.
  useLayoutEffect(() => {
    const measure = () => {
      const el = scrollerRef.current
      if (el) setVisible(Math.min(1, el.clientWidth / el.scrollWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [projects])

  const step = (direction: 1 | -1) => {
    const el = scrollerRef.current
    el?.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' })
  }

  // Trascinamento con il mouse; se il puntatore si è mosso, il click non apre il progetto.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !scrollerRef.current) return
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startLeft: scrollerRef.current.scrollLeft,
    }
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!drag.current.active || !el) return
    const dx = event.clientX - drag.current.startX
    if (Math.abs(dx) > 5) drag.current.moved = true
    el.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = () => {
    drag.current.active = false
  }
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      drag.current.moved = false
    }
  }

  // Barra: cliccando o trascinando sul binario la fila si sposta in quel punto.
  const seek = (clientX: number) => {
    const el = scrollerRef.current
    const bar = barRef.current?.getBoundingClientRect()
    if (!el || !bar) return
    const ratio = Math.min(1, Math.max(0, (clientX - bar.left) / bar.width))
    el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth)
  }
  const onBarDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    seek(event.clientX)
  }
  const onBarMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event.clientX)
  }

  return (
    <div className="relative -mt-12 h-[min(100svh,56rem)] overflow-hidden">
      <motion.p
        aria-hidden
        style={{ x: wordX }}
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[38vw] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-ink uppercase select-none"
      >
        Work<span className="ml-[0.35em]">Work</span>
      </motion.p>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className="relative flex h-full cursor-grab items-center overflow-x-auto overscroll-x-contain select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex shrink-0 items-center gap-[7vw] pr-[12vw] pl-[10vw]">
          {projects.map((project, i) => (
            <CollageCard key={project.slug} project={project} index={i} />
          ))}
        </ul>
      </div>

      {/* Comandi: frecce e barra trascinabile */}
      <div className="absolute inset-x-0 bottom-6 flex items-center gap-5 px-page label">
        <span className="hidden lg:inline">Drag or scroll</span>
        <div
          ref={barRef}
          role="group"
          aria-label="Projects"
          onPointerDown={onBarDown}
          onPointerMove={onBarMove}
          className="relative flex h-6 flex-1 cursor-pointer items-center touch-none"
        >
          <span aria-hidden className="h-px w-full bg-grey-300" />
          <motion.span
            aria-hidden
            className="absolute h-[3px] rounded-full bg-ink"
            style={{ left: thumbLeft, width: `${visible * 100}%` }}
          />
        </div>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => step(direction)}
              aria-label={direction === -1 ? 'Previous projects' : 'Next projects'}
              className="grid size-11 place-items-center rounded-full border border-ink bg-paper text-base transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              {direction === -1 ? '←' : '→'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function CollageCard({ project, index }: { project: Project; index: number }) {
  const slot = collage[index % collage.length] ?? collage[0]

  return (
    <li className={cn('w-[min(24vw,46vh)] shrink-0', slot.offset)}>
      <ProjectLink
        slug={project.slug}
        aria-label={`${project.title} — ${project.discipline}`}
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
            <MediaFrame media={{ ...project.cover, aspect: 'portrait' }} sizes="min(24vw, 46vh)" />
          </div>
        </motion.div>
        {/* Didascalia su fondo carta: leggibile anche sopra la scritta WORK nera */}
        <div className="mt-4 flex flex-col items-start gap-1">
          <span className="bg-paper px-2 py-1 text-[clamp(1.25rem,0.8rem+1.2vw,2.25rem)] leading-none font-bold tracking-[-0.04em] uppercase">
            {/* inline-block: se il titolo va a capo, la linea compare solo sotto l'ultima riga */}
            <span className="inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_2px]">
              {project.title}
            </span>
          </span>
          <span className="bg-paper px-2 py-1 label text-grey-500">
            {pad(index + 1)} — {project.discipline}
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
            aria-label={`${project.title} — ${project.discipline}`}
            className="block"
          >
            <MediaFrame media={{ ...project.cover, aspect: 'portrait' }} sizes="78vw" />
            <p className="mt-3 text-lead leading-none font-bold tracking-[-0.04em] uppercase">
              {project.title}
            </p>
            <p className="mt-2 label text-grey-500">{project.discipline}</p>
          </ProjectLink>
        </li>
      ))}
    </ul>
  )
}
