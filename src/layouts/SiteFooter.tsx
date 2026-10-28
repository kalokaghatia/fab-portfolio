import { Wordmark } from '@/components/Wordmark'
import { navigation, site } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-ink px-page pb-4 text-paper">
      <div className="grid-page gap-y-4 border-t border-grey-700 pt-4 label text-grey-400">
        <p className="col-span-2">
          ©{site.year} {site.name}
        </p>
        <ul className="col-span-2 flex flex-wrap justify-end gap-x-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
          {navigation.map((item) => (
            <li key={item.href}>
              {/* py-1.5: area di tocco di almeno 24px anche quando i link vanno a capo */}
              <a href={item.href} className="inline-block py-1.5 hover:text-paper">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="mt-6">
        <Wordmark />
      </div>
    </footer>
  )
}
