import { Wordmark } from '@/components/Wordmark'
import { navigation, site } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-ink px-page pt-[clamp(1.25rem,5svh,6rem)] pb-[clamp(1rem,3svh,1.5rem)] text-paper">
      {/* Logo in proporzione al resto della pagina: si adatta alla larghezza del riquadro */}
      <div className="flex items-end justify-between gap-6">
        <div aria-hidden className="w-1/2 max-w-[32svh] md:w-1/3 lg:w-1/4">
          <Wordmark />
        </div>
        <a
          href="#top"
          className="group inline-flex items-center gap-2 label text-grey-400 hover:text-paper"
        >
          Back to top
          <span
            aria-hidden
            className="transition-transform duration-500 ease-editorial group-hover:-translate-y-0.5"
          >
            ↑
          </span>
        </a>
      </div>
      <div className="mt-[clamp(0.75rem,3svh,2rem)] grid-page gap-y-4 border-t border-grey-700 pt-4 label text-grey-400">
        <p className="col-span-2">
          ©{site.year} {site.name}
        </p>
        <ul className="col-span-2 flex flex-wrap justify-end gap-x-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
          {navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="hover:text-paper">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
