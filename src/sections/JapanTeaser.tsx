import { PageLink } from '@/components/PageLink'
import { FadeIn, Reveal } from '@/components/Reveal'
import { RevealImage } from '@/components/RevealImage'
import { japanJournal } from '@/content/site'
import { cityPath, japanPath } from '@/lib/router'
import { cn } from '@/utils/cn'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function entryNumber(i: number) {
  return `No. ${String(i + 1).padStart(2, '0')}`
}

function Caption({ label, i }: { label: string; i: number }) {
  return (
    <FadeIn delay={0.3} className="mt-3 flex justify-between gap-3 label">
      <span className="text-grey-500">{entryNumber(i)}</span>
      <span>{label}</span>
    </FadeIn>
  )
}

/**
 * Japan Journal in homepage: impaginato come una rivista, a griglia ordinata.
 * Riga 1: copertina a tutta larghezza con il titolo sovrapposto.
 * Riga 2: manifesto con le tappe del viaggio e, accanto, quattro foto (due sopra e due sotto)
 * allineate esattamente al bordo superiore e inferiore del manifesto.
 * Ogni elemento apre la pagina completa del journal.
 */
export function JapanTeaser() {
  const { cover, cities, diary } = japanJournal

  return (
    <section id="japan" className="bg-paper px-page py-section" aria-labelledby="japan-title">
      <div className="flex items-baseline justify-between border-b border-ink pb-3 label">
        <span>(04) Journal</span>
        <span className="text-grey-500">
          Vol. 01 — {String(cities.length).padStart(2, '0')} cities
        </span>
      </div>

      <PageLink to={japanPath} className="mt-2 block" aria-label="Open the Japan Journal">
        <div className="relative">
          <RevealImage
            media={cover}
            fill
            className="aspect-[4/5] md:aspect-[16/8] lg:aspect-[16/7]"
          />
          {/* Titolo sovrapposto alla copertina */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-t from-ink/55 via-transparent to-ink/30 p-4 text-paper md:p-6">
            <div className="flex justify-between label">
              <span>{entryNumber(0)}</span>
              <span>Cover story</span>
            </div>
            <h2 id="japan-title" className="text-display font-extrabold uppercase md:text-right">
              <Reveal delay={0.4}>Japan</Reveal>
              <Reveal delay={0.5}>Journal</Reveal>
            </h2>
          </div>
        </div>
        <Caption label={cities.map((city) => city.name).join(' · ')} i={0} />
      </PageLink>

      {/* Stessa distanza tra righe e colonne: la griglia di foto resta regolare */}
      <div className="mt-2 grid-page gap-y-[clamp(0.75rem,0.5rem+0.8vw,1.5rem)] md:mt-6">
        {/*
          "A visual diary": le tappe come un manifesto tipografico in negativo. Su computer occupa
          due righe, così è alto esattamente quanto le quattro foto accanto. Nomi grandi alternati bianco/grigio; al passaggio del mouse
          la città indicata resta bianca e le altre si spengono.
        */}
        <FadeIn className="col-span-4 md:col-span-6 lg:col-span-4 lg:row-span-2">
          <div className="group/card flex h-full flex-col justify-between gap-10 bg-ink p-5 text-paper md:p-6">
            <span className="flex items-baseline justify-between label">
              <span>A visual diary</span>
              <span lang="ja" aria-hidden className="font-jp text-grey-400">
                日本
              </span>
            </span>

            <ol className="group/list">
              {cities.map((city, i) => (
                <li key={city.slug}>
                  {/* Ogni città porta direttamente alla sua tappa nel journal */}
                  <PageLink
                    to={cityPath(city.slug)}
                    aria-label={`${city.name} — Japan Journal`}
                    className={cn(
                      'flex items-start justify-between gap-3 transition-colors duration-500 group-hover/list:text-grey-600 hover:!text-paper',
                      i % 2 === 1 && 'text-grey-500',
                    )}
                  >
                    <span className="flex items-start gap-2">
                      <span className="mt-[0.5em] label text-grey-500">{pad(i + 1)}</span>
                      <Reveal
                        delay={0.08 * i}
                        className="text-[clamp(2.25rem,1.2rem+3vw,3.75rem)] leading-[0.9] font-extrabold tracking-[-0.045em] uppercase"
                      >
                        {city.name}
                      </Reveal>
                    </span>
                    <span lang="ja" aria-hidden className="mt-[0.4em] font-jp text-sm">
                      {city.kanji}
                    </span>
                  </PageLink>
                </li>
              ))}
            </ol>

            <span className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-4 label">
              <span className="flex items-center gap-2 text-grey-400">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-paper motion-safe:animate-pulse"
                />
                Stay tuned — next trip
              </span>
              <PageLink
                to={japanPath}
                className="group/open inline-flex items-center gap-2 border-b border-paper pb-1"
              >
                Open the journal
                <span className="transition-transform duration-500 ease-editorial group-hover/open:translate-x-1">
                  →
                </span>
              </PageLink>
            </span>
          </div>
        </FadeIn>

        {/* Foto a riquadro fisso, didascalia sopra l'immagine: nessuna riga di testo sporge dal margine */}
        {diary.map(({ slug, label, photo }, i) => (
          <PageLink
            key={label}
            to={cityPath(slug)}
            className="relative col-span-2 block md:col-span-3 lg:col-span-4"
            aria-label={`${label} — Japan Journal`}
          >
            <RevealImage
              media={photo}
              fill
              delay={0.1 * (i + 1)}
              className="aspect-[4/5] lg:aspect-[4/3]"
            />
            <span className="pointer-events-none absolute bottom-2 left-2 flex gap-3 bg-paper px-2 py-1 label">
              <span className="text-grey-500">{entryNumber(i + 1)}</span>
              <span>{label}</span>
            </span>
          </PageLink>
        ))}
      </div>
    </section>
  )
}
