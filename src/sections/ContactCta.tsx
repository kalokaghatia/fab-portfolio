import { Reveal } from '@/components/Reveal'
import { contact } from '@/content/site'

export function ContactCta() {
  return (
    <section
      id="contact"
      className="bg-ink px-page pt-section pb-16 text-paper"
      aria-labelledby="contact-title"
    >
      <div className="grid-page gap-y-10">
        <p className="col-span-4 label text-grey-400 md:col-span-2">(05) Contact</p>
        <h2
          id="contact-title"
          className="col-span-4 text-display font-extrabold uppercase md:col-span-6 lg:col-span-12"
        >
          <Reveal>Have something</Reveal>
          <Reveal delay={0.08}>in mind?</Reveal>
        </h2>
      </div>

      <div className="mt-14 grid-page gap-y-10 border-t border-grey-700 pt-6 md:mt-24">
        <div className="col-span-4 md:col-span-4 lg:col-span-8">
          <p className="label text-grey-400">Write me</p>
          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 inline-block text-lead font-semibold break-all underline decoration-1 underline-offset-[0.2em] transition-opacity hover:opacity-60"
            >
              {contact.email}
            </a>
          ) : (
            <p className="mt-3 text-lead font-semibold text-grey-400">[email@to-be-added]</p>
          )}
        </div>

        <ul className="col-span-4 flex gap-6 label md:col-span-2 lg:col-span-4 lg:flex-col lg:items-end lg:gap-2">
          {contact.socials.map((social) =>
            social.href ? (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer" className="hover:opacity-60">
                  {social.label} ↗
                </a>
              </li>
            ) : (
              <li key={social.label} className="text-grey-400">
                {social.label} — [link]
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  )
}
