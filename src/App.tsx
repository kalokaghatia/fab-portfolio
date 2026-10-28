import { AnimatePresence, MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { projects, site } from '@/content/site'
import { usePathname } from '@/hooks/usePathname'
import { SiteFooter } from '@/layouts/SiteFooter'
import { SiteHeader } from '@/layouts/SiteHeader'
import { navigate, projectPath, type RouteState } from '@/lib/router'
import { ProjectPage } from '@/pages/ProjectPage'
import { ContactCta } from '@/sections/ContactCta'
import { Hero } from '@/sections/Hero'
import { Intro } from '@/sections/Intro'
import { JapanTeaser } from '@/sections/JapanTeaser'
import { SelectedWork } from '@/sections/SelectedWork'
import { ThroughMyEyes } from '@/sections/ThroughMyEyes'

export default function App() {
  const pathname = usePathname()
  // La homepage resta sempre montata: aprendo e chiudendo un progetto non si perde la posizione.
  const activeProject = projects.find((p) => projectPath(p.slug) === pathname)
  const projectOpen = activeProject !== undefined

  // Indirizzo sconosciuto (es. un progetto rimosso): si mostra la homepage, con l'URL corretto.
  useEffect(() => {
    if (pathname !== '/' && !projectOpen) navigate('/', {}, { replace: true })
  }, [pathname, projectOpen])

  // Titolo e blocco dello scroll dipendono dal progetto attivo, non dalla singola pagina:
  // passando al progetto successivo le due pagine convivono durante l'animazione,
  // e quella che esce non deve ripristinare lo stato della homepage.
  useEffect(() => {
    if (!activeProject) return
    const previousTitle = document.title
    document.title = `${activeProject.title} — ${site.name}`
    return () => {
      document.title = previousTitle
    }
  }, [activeProject])

  useEffect(() => {
    if (!projectOpen) return
    // Se il progetto è stato aperto da una card, chiudendo il focus torna lì invece di perdersi.
    const state = window.history.state as RouteState | null
    const opener = state?.fromSite
      ? document.querySelector<HTMLElement>(`main a[href="${window.location.pathname}"]`)
      : null
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      opener?.focus({ preventScroll: true })
    }
  }, [projectOpen])

  return (
    // reducedMotion="user": con "riduci movimento" le animazioni di spostamento diventano istantanee.
    // Le parallassi legate allo scroll le disattivano i singoli componenti (useReducedMotion).
    <MotionConfig reducedMotion="user">
      {/* Con un progetto aperto la homepage resta visibile sotto, ma tastiera, mouse e screen reader non la raggiungono. */}
      <div inert={projectOpen}>
        <SiteHeader />
        <main>
          <Hero />
          <Intro />
          <SelectedWork />
          <ThroughMyEyes />
          <JapanTeaser />
          <ContactCta />
        </main>
        <SiteFooter />
      </div>
      <AnimatePresence>
        {activeProject && <ProjectPage key={activeProject.slug} project={activeProject} />}
      </AnimatePresence>
    </MotionConfig>
  )
}
