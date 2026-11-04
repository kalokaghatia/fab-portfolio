import { useEffect, useState } from 'react'
import wavesUrl from '@/assets/ticket-waves.svg'
import { FadeIn, Reveal } from '@/components/Reveal'
import { Glyph } from '@/components/Glyph'
import { contact } from '@/content/site'

export function ContactCta() {
  const [copied, setCopied] = useState(false)
  const { ticket } = contact

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
      className="flex flex-1 flex-col bg-ink px-page pt-[clamp(1.25rem,5svh,4rem)] pb-[clamp(1rem,4svh,3rem)] text-paper"
      aria-labelledby="contact-title"
    >
      <div className="grid-page gap-y-[clamp(1rem,3.5svh,2.5rem)] border-t border-paper/20 pt-4">
        <p className="col-span-4 label text-grey-400 md:col-span-2">(06) Contact</p>
        <h2
          id="contact-title"
          // Il titolo resta su due righe e non supera il 15% dell'altezza schermo:
          // così contatti e footer ci stanno interi
          className="col-span-4 text-display font-extrabold uppercase [font-size:min(var(--text-display),15svh,10.5vw)] md:col-span-6 lg:col-span-12"
        >
          <Reveal>Have something</Reveal>
          <Reveal delay={0.08}>in mind?</Reveal>
        </h2>
      </div>

      {/*
        Carta d'imbarco: a sinistra la matrice da strappare con il francobollo del Fuji,
        a destra il biglietto con le linee ondulate di sicurezza, l'email e i social.
      */}
      <FadeIn className="mt-auto flex pt-[clamp(1rem,3svh,3rem)] text-ink">
        <div className="flex w-[clamp(6.5rem,20vw,9.5rem)] shrink-0 flex-col gap-[clamp(0.5rem,1.5svh,0.75rem)] rounded-l-lg border-r-2 border-dashed border-grey-300 bg-paper p-[clamp(0.625rem,2svh,1rem)]">
          <div className="stamp w-full max-w-[clamp(4.5rem,13svh,6.5rem)]">
            <img
              src={ticket.stamp.src}
              srcSet={ticket.stamp.srcSet}
              sizes="6.5rem"
              width={ticket.stamp.width}
              height={ticket.stamp.height}
              alt={ticket.stamp.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          <p className="label text-grey-500">
            <span className="whitespace-nowrap">Ticket {ticket.number}</span>
            <span className="mt-1 flex items-center gap-1">
              {ticket.route.from} <Glyph name="arrow-right" /> {ticket.route.to}
            </span>
          </p>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-r-lg bg-paper p-[clamp(0.75rem,2.5svh,1.5rem)] @container">
          {/* Linee ondulate da tre centri, calcolate una volta sola: vedi src/assets/ticket-waves.svg */}
          <img
            src={wavesUrl}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 size-full"
          />
          <div className="relative flex items-center justify-between label text-grey-500">
            <span>Boarding pass</span>
            <span className="flex items-center gap-1">
              Gate <Glyph name="asterisk" />
            </span>
          </div>

          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="group relative mt-auto flex items-end gap-[0.3em] pt-[clamp(0.5rem,3svh,3rem)] text-[length:min(2.5rem,8cqi)] leading-[0.95] font-extrabold tracking-[-0.045em] whitespace-nowrap"
            >
              {/* L'email sta sempre su una riga: la misura segue la larghezza del biglietto */}
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_0.06em] bg-bottom-left bg-no-repeat pb-[0.05em] transition-[background-size] duration-700 ease-editorial group-hover:bg-[length:100%_0.06em]">
                {contact.email}
              </span>
              <span
                aria-hidden
                className="shrink-0 font-light transition-transform duration-700 ease-editorial group-hover:rotate-45"
              >
                <Glyph name="arrow-up-right" strokeWidth={1.25} />
              </span>
            </a>
          ) : (
            <p className="relative mt-auto pt-6 text-lead font-semibold text-grey-500">
              [email@to-be-added]
            </p>
          )}

          <div className="relative mt-[clamp(0.5rem,2svh,1rem)] flex flex-wrap items-center gap-x-5 gap-y-2 label">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {contact.socials.map((social) =>
                social.href ? (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 border-b border-ink pb-1"
                    >
                      {social.icon && (
                        <Glyph name={social.icon} strokeWidth={1.5} className="text-base" />
                      )}
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
            {contact.email && (
              <button
                type="button"
                onClick={() => void copyEmail()}
                className="ml-auto border border-ink bg-paper px-3 py-2 transition-colors duration-300 hover:bg-ink hover:text-paper"
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
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
