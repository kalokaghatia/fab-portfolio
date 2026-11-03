import { motion } from 'motion/react'
import { FadeIn, Reveal } from '@/components/Reveal'
import { RevealImage } from '@/components/RevealImage'
import { contact, intro, portrait } from '@/content/site'
import { cn } from '@/utils/cn'

/**
 * About: impaginato a due colonne allineate in alto, come una scheda di rivista.
 * Sinistra: ritratto. Destra: titolo, presentazione, scheda dati, discipline e contatto.
 * In fondo una fascia nera con un nastro di parole chiave in movimento.
 */
export function Intro() {
  return (
    <section id="about" className="bg-paper pt-section" aria-labelledby="about-title">
      <div className="px-page">
        <div className="flex items-baseline justify-between border-b border-ink pb-3 label">
          <span>(01) About</span>
          <span className="text-grey-500">Who’s Fab?</span>
        </div>

        <div className="mt-6 grid-page gap-y-12 md:mt-10">
          <figure className="col-span-4 md:col-span-3 lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
            <RevealImage media={portrait} className="grayscale" />
            <figcaption className="mt-3 flex justify-between label">
              <span>Fab.</span>
              <span className="text-grey-500">Portrait — Studio</span>
            </figcaption>
          </figure>

          <div className="col-span-4 flex flex-col md:col-span-3 lg:col-span-6 lg:col-start-7">
            <h2 id="about-title" className="text-title font-bold uppercase">
              <Reveal>{intro.heading}</Reveal>
            </h2>
            <FadeIn delay={0.1}>
              <p className="mt-6 max-w-[26ch] text-lead font-medium md:mt-8">{intro.statement}</p>
              <p className="mt-5 max-w-[42ch] text-small text-grey-600">{intro.note}</p>
            </FadeIn>

            {/*
              Discipline come una riga tipografica continua, alternando nero e grigio.
              Al passaggio del mouse le altre si spengono e resta in evidenza quella indicata.
            */}
            <FadeIn delay={0.2} className="mt-12 border-t border-ink pt-4 md:mt-14">
              <p className="label">What I do</p>
              <ul className="group/list mt-5 text-[clamp(2rem,1rem+2.6vw,3.75rem)] leading-[0.98] font-bold tracking-[-0.045em] uppercase">
                {intro.disciplines.map((discipline, i) => (
                  <li key={discipline} className="inline">
                    <span
                      className={cn(
                        'cursor-default whitespace-nowrap transition-colors duration-500 group-hover/list:text-grey-300 hover:!text-ink',
                        i % 2 === 1 && 'text-grey-400',
                      )}
                    >
                      {discipline}
                    </span>
                    {i < intro.disciplines.length - 1 && (
                      <span
                        aria-hidden
                        className="mx-[0.25em] inline-block align-[0.35em] text-[0.4em] text-grey-400"
                      >
                        ✳
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn
              delay={0.4}
              className="mt-10 flex flex-wrap items-center justify-between gap-4 label"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 bg-ink px-4 py-3 text-paper transition-opacity hover:opacity-80"
              >
                Let’s work together
                <span className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
                  →
                </span>
              </a>
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="border-b border-ink pb-1 normal-case hover:opacity-60"
                >
                  {contact.email}
                </a>
              )}
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Fascia nera con parole chiave che scorrono */}
      <div className="mt-section overflow-hidden bg-ink py-5 text-paper" aria-hidden>
        <motion.div
          className="flex w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {[...intro.marquee, ...intro.marquee].map((word, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center text-title font-bold uppercase"
                >
                  <span className="px-6 md:px-10">{word}</span>
                  <span className="text-lead text-grey-500">✳</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
