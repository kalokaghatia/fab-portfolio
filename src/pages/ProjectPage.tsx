import { motion } from 'motion/react'
import { useEffect } from 'react'
import { MediaFrame } from '@/components/MediaFrame'
import { ProjectLink } from '@/components/ProjectLink'
import { Reveal } from '@/components/Reveal'
import { projects, site } from '@/content/site'
import { ease } from '@/lib/motion'
import { navigate, type RouteState } from '@/lib/router'
import type { Media, Project } from '@/types/content'
import { cn } from '@/utils/cn'

/**
 * Pagina di un progetto, aperta sopra la homepage come un foglio che sale.
 * Le immagini sono mostrate intere, senza ritagli, nel loro formato originale.
 */
export function ProjectPage({ project }: { project: Project }) {
  const images = [project.cover, ...(project.gallery ?? [])]
  const position = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(position + 1) % projects.length]
  const details = [
    { label: 'Client', value: project.client },
    { label: 'Role', value: project.role },
    { label: 'Year', value: project.year },
  ].filter((d): d is { label: string; value: string } => Boolean(d.value))

  // Torna alla homepage: con "Indietro" se la pagina è stata aperta dal sito,
  // altrimenti (link diretto) con una nuova navigazione.
  const close = () => {
    const state = window.history.state as RouteState | null
    if (state?.fromSite) window.history.back()
    else navigate('/')
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${project.title} — ${site.name}`
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.title = previousTitle
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  })

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-paper"
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-paper/90 px-page py-4 backdrop-blur-sm">
        <span className="text-xl leading-none font-extrabold tracking-[-0.05em]">{site.name}</span>
        <button
          type="button"
          onClick={close}
          className="group flex items-center gap-2 label"
          autoFocus
        >
          Close
          <span
            aria-hidden
            className="text-base transition-transform duration-500 ease-editorial group-hover:rotate-90"
          >
            ✕
          </span>
        </button>
      </div>

      <article className="px-page pb-section">
        <header className="mt-6 border-t border-ink pt-4">
          <div className="flex items-baseline justify-between label">
            <span>{project.category}</span>
            <span className="text-grey-500">Selected Work</span>
          </div>
          <h1 id="project-title" className="mt-10 text-title font-extrabold uppercase md:mt-16">
            <Reveal delay={0.4}>{project.title}</Reveal>
          </h1>

          <div className="mt-10 grid-page gap-y-8 md:mt-14">
            <dl className="col-span-4 md:col-span-3 lg:col-span-4">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex justify-between gap-4 border-b border-grey-200 py-2"
                >
                  <dt className="label text-grey-500">{detail.label}</dt>
                  <dd className="label">{detail.value}</dd>
                </div>
              ))}
            </dl>
            {project.description && (
              <p className="col-span-4 max-w-[34ch] text-lead font-medium md:col-span-3 lg:col-span-6 lg:col-start-7">
                {project.description}
              </p>
            )}
          </div>
        </header>

        {/* Galleria: immagini intere, due per riga; se sono dispari l'ultima va al centro */}
        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-6">
          {images.map((media, i) => (
            <li
              key={`${media.alt}-${i}`}
              className={cn(
                images.length % 2 === 1 &&
                  i === images.length - 1 &&
                  'md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)]',
              )}
            >
              <ProjectImage media={media} index={i} />
            </li>
          ))}
        </ul>

        {next && next.slug !== project.slug && (
          <ProjectLink
            slug={next.slug}
            className="group mt-section block border-t border-ink pt-4"
            aria-label={`Next project: ${next.title}`}
          >
            <span className="flex justify-between label">
              <span>Next project</span>
              <span className="text-grey-500">{next.category}</span>
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
        )}
      </article>
    </motion.div>
  )
}

function ProjectImage({ media, index }: { media: Media; index: number }) {
  if (!media.src) return <MediaFrame media={media} index={index + 1} />

  return (
    <motion.img
      src={media.src}
      alt={media.alt}
      loading={index < 2 ? 'eager' : 'lazy'}
      decoding="async"
      className={cn(
        'block h-auto',
        media.cutout && 'mix-blend-multiply',
        // PNG scontornati: alla loro dimensione naturale (mai ingranditi), centrati.
        media.fit === 'contain' ? 'mx-auto w-auto max-w-full py-8' : 'w-full',
      )}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease, delay: index < 2 ? 0.3 + index * 0.1 : 0 }}
    />
  )
}
