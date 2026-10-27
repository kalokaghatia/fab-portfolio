import { AnimatePresence, MotionConfig } from 'motion/react'
import { projects } from '@/content/site'
import { usePathname } from '@/hooks/usePathname'
import { SiteFooter } from '@/layouts/SiteFooter'
import { SiteHeader } from '@/layouts/SiteHeader'
import { projectPath } from '@/lib/router'
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

  return (
    // reducedMotion="user": con "riduci movimento" attivo spariscono gli spostamenti, restano le dissolvenze.
    <MotionConfig reducedMotion="user">
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
      <AnimatePresence>
        {activeProject && <ProjectPage key={activeProject.slug} project={activeProject} />}
      </AnimatePresence>
    </MotionConfig>
  )
}
