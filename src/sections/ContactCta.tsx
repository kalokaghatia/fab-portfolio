import { useEffect, useState } from 'react'
import { FadeIn, Reveal } from '@/components/Reveal'
import { Glyph } from '@/components/Glyph'
import { contact } from '@/content/site'

export function ContactCta() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  const copyEmail = async () => {
    if (!contact.email) return
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
    } catch {
      // API Appunti non disponibile o negata: copia con una textarea temporanea.
      const field = document.createElement('textarea')
      field.value = contact.email
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.append(field)
      field.select()
      // execCommand è deprecato ma resta l'unico ripiego dove la Clipboard API è bloccata.
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      setCopied(document.execCommand('copy'))
      field.remove()
    }
  }

  return (
    <section
      id="contact"
      className="bg-ink px-page pt-12 pb-16 text-paper md:pt-16"
      aria-labelledby="contact-title"
    >
      <div className="grid-page gap-y-10 border-t border-paper/20 pt-4">
        <p className="col-span-4 label text-grey-400 md:col-span-2">(06) Contact</p>
        <h2
          id="contact-title"
          className="col-span-4 text-display font-extrabold uppercase md:col-span-6 lg:col-span-12"
        >
          <Reveal>Have something</Reveal>
          <Reveal delay={0.08}>in mind?</Reveal>
        </h2>
      </div>

      {/*
        "Write me": email grande in bianco pieno sul nero, tra due linee sottili.
        Il contrasto nasce dalla scala del testo, non da un riquadro. Al passaggio del mouse
        la freccia ruota e una linea si disegna sotto l'indirizzo.
      */}
      <FadeIn className="mt-14 md:mt-24">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="group block border-y border-paper/30 py-6 text-paper md:py-10"
          >
            <span className="flex items-baseline justify-between label">
              <span>Write me</span>
              <span className="text-grey-400">Click to send</span>
            </span>
            <span className="mt-8 flex items-end justify-between gap-4 md:mt-14">
              <span className="text-[clamp(1.2rem,0.95rem+1.2vw,2.25rem)] leading-[0.95] font-extrabold tracking-[-0.045em] break-all">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_0.06em] bg-bottom-left bg-no-repeat pb-[0.05em] transition-[background-size] duration-700 ease-editorial group-hover:bg-[length:100%_0.06em]">
                  {contact.email}
                </span>
              </span>
              <span
                aria-hidden
                className="shrink-0 text-[clamp(1.2rem,0.95rem+1.2vw,2.25rem)] leading-none font-light transition-transform duration-700 ease-editorial group-hover:rotate-45"
              >
                <Glyph name="arrow-up-right" strokeWidth={1.25} />
              </span>
            </span>
          </a>
        ) : (
          <p className="border-y border-paper/30 py-6 text-lead font-semibold text-grey-500 md:py-10">
            [email@to-be-added]
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 label">
          {contact.email && (
            <button
              type="button"
              onClick={() => void copyEmail()}
              className="border border-paper px-4 py-3 transition-colors duration-300 hover:bg-paper hover:text-ink"
              aria-live="polite"
            >
              {copied ? (
                <>
                  Copied <Glyph name="check" />
                </>
              ) : (
                'Copy email'
              )}
            </button>
          )}

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {contact.socials.map((social) =>
              social.href ? (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 border-b border-paper pb-1"
                  >
                    {social.label}
                    {social.handle && <span className="normal-case">{social.handle}</span>}
                    <span
                      aria-hidden
                      className="transition-transform duration-500 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <Glyph name="arrow-up-right" />
                    </span>
                  </a>
                </li>
              ) : (
                <li key={social.label} className="text-grey-500">
                  {social.label} — [link]
                </li>
              ),
            )}
          </ul>
        </div>
      </FadeIn>
    </section>
  )
}
