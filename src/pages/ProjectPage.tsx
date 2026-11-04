import { motion } from 'motion/react'
import { MediaFrame } from '@/components/MediaFrame'
import { Overlay } from '@/components/Overlay'
import { ProjectLink } from '@/components/ProjectLink'
import { FadeIn, Reveal } from '@/components/Reveal'
import { projects, site } from '@/content/site'
import { ease } from '@/lib/motion'
import type { Media, Project } from '@/types/content'
import { cn } from '@/utils/cn'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/**
 * Pagina di un progetto, aperta sopra la homepage come un foglio che sale.
 * Si legge come un articolo di rivista: titolo e sottotitolo, la copertina in scena
 * davanti al numero del progetto, la scheda tecnica e il racconto, poi le immagini.
 */
export function ProjectPage({ project }: { project: Project }) {
  const position = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(position + 1) % projects.length]
  const details = [
    { label: 'Discipline', value: project.discipline },
    { label: 'Context', value: project.context },
    { label: 'Deliverables', value: project.deliverables },
    { label: 'Credits', value: project.credits },
  ].filter((d): d is { label: string; value: string } => Boolean(d.value))
  const [lead, ...paragraphs] = project.description

  return (
    <Overlay title={`${project.title} — ${site.name}`} labelledBy="project-title">
      <article className="pb-section">
        <header className="px-page">
          <div className="mt-6 flex items-baseline justify-between border-t border-ink pt-4 label">
            <span>
              Project {pad(position + 1)} / {pad(projects.length)}
            </span>
            <span className="text-grey-500">{project.discipline}</span>
          </div>
          <h1
            id="project-title"
            className="mt-10 text-[12.5vw] leading-[0.85] font-extrabold tracking-[-0.05em] uppercase md:mt-14 md:text-display"
          >
            <Reveal delay={0.35}>{project.title}</Reveal>
          </h1>
          <FadeIn
            delay={0.55}
            className="mt-6 max-w-[30ch] text-[clamp(1.25rem,0.9rem+1.2vw,2rem)] leading-tight font-medium tracking-[-0.02em] text-grey-600 md:mt-8"
          >
            {project.subtitle}
          </FadeIn>
        </header>

        <CoverStage project={project} number={pad(position + 1)} />

        {/* Scheda tecnica a sinistra, racconto a destra */}
        <section
          aria-label="About the project"
          className="mt-16 grid-page gap-y-12 px-page md:mt-24"
        >
          <FadeIn className="col-span-4 md:col-span-2 lg:col-span-4">
            <p className="label text-grey-500">(About)</p>
            <dl className="mt-6 border-t border-ink">
              {details.map((detail) => (
                <div key={detail.label} className="border-b border-grey-200 py-3">
                  <dt className="label text-grey-500">{detail.label}</dt>
                  <dd className="mt-1 font-medium">{detail.value}</dd>
                </div>
              ))}
            </dl>
            {project.link && (
              <a
                href={project.link.href}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 label"
              >
                {project.link.label}
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            )}
          </FadeIn>

          <div className="col-span-4 md:col-span-4 lg:col-span-7 lg:col-start-6">
            {lead && (
              <FadeIn className="text-[clamp(1.5rem,1rem+1.6vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
                {lead}
              </FadeIn>
            )}
            {paragraphs.map((paragraph) => (
              <FadeIn key={paragraph} className="mt-8 max-w-[52ch] text-body text-grey-700">
                {paragraph}
              </FadeIn>
            ))}
          </div>
        </section>

        {/*
          Galleria: immagini intere, due per riga; se sono dispari l'ultima va al centro.
          Le immagini "wide" occupano invece tutta la riga.
        */}
        {project.gallery && project.gallery.length > 0 && (
          <ul className="mt-section grid gap-4 px-page md:grid-cols-2 md:gap-6">
            {project.gallery.map((media, i, all) => (
              <li
                key={`${media.alt}-${i}`}
                className={cn(
                  media.wide
                    ? 'md:col-span-2'
                    : all.length % 2 === 1 &&
                        i === all.length - 1 &&
                        'md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)]',
                )}
              >
                <GalleryImage media={media} index={i} />
              </li>
            ))}
          </ul>
        )}

        {next && next.slug !== project.slug && (
          <div className="px-page">
            <ProjectLink
              slug={next.slug}
              className="group mt-section block border-t border-ink pt-4"
              aria-label={`Next project: ${next.title}`}
            >
              <span className="flex justify-between label">
                <span>Next project</span>
                <span className="text-grey-500">{next.discipline}</span>
              </span>
              <span className="mt-6 flex items-end justify-between gap-6 text-title font-extrabold uppercase">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_3px] bg-bottom-left bg-no-repeat transition-[background-size] duration-700 ease-editorial group-hover:bg-[length:100%_3px]">
                  {next.title}
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-editorial group-hover:translate-x-2"
                >
                  →
                </span>
              </span>
            </ProjectLink>
          </div>
        )}
      </article>
    </Overlay>
  )
}

/**
 * La copertina "in scena": entra dal basso davanti al numero del progetto in grande,
 * che sale dietro di lei come la scritta WORK della galleria in homepage.
 */
function CoverStage({ project, number }: { project: Project; number: string }) {
  const { cover } = project

  return (
    <div className="relative mt-12 flex justify-center overflow-hidden px-page py-10 md:mt-16 md:py-16">
      <motion.p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[60vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-grey-200 select-none md:text-[46vw]"
        initial={{ opacity: 0, y: '12%' }}
        animate={{ opacity: 1, y: '0%' }}
        transition={{ duration: 1.4, ease, delay: 0.4 }}
      >
        {number}
      </motion.p>
      {cover.src ? (
        <motion.img
          sizes={cover.srcSet ? 'min(100vw, 78svh)' : undefined}
          srcSet={cover.srcSet}
          src={cover.src}
          width={cover.width}
          height={cover.height}
          alt={cover.alt}
          decoding="async"
          className={cn(
            'relative block h-auto max-h-[78svh] w-auto max-w-full',
            cover.cutout && 'mix-blend-multiply',
          )}
          initial={{ opacity: 0, y: 80, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.6 }}
        />
      ) : (
        <div className="relative w-[min(60vw,24rem)]">
          <MediaFrame media={cover} index={1} />
        </div>
      )}
    </div>
  )
}

/** Immagini della galleria: si aprono dal basso come una tenda quando entrano nello schermo. */
function GalleryImage({ media, index }: { media: Media; index: number }) {
  if (!media.src) return <MediaFrame media={media} index={index + 2} />

  return (
    <motion.img
      // Due per riga da 768px in su, una sola su mobile e per le immagini "wide"
      sizes={media.srcSet ? (media.wide ? '100vw' : '(min-width: 48rem) 50vw, 100vw') : undefined}
      srcSet={media.srcSet}
      src={media.src}
      width={media.width}
      height={media.height}
      alt={media.alt}
      loading="lazy"
      decoding="async"
      className={cn(
        'block h-auto',
        media.cutout && 'mix-blend-multiply',
        // PNG scontornati: alla loro dimensione naturale (mai ingranditi), centrati.
        media.fit === 'contain' ? 'mx-auto max-h-[85svh] w-auto max-w-full' : 'w-full',
      )}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)', y: 40 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease }}
    />
  )
}
