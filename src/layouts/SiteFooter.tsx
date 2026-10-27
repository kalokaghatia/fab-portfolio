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
              <a href={item.href} className="hover:text-paper">
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
