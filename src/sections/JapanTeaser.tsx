import { FadeIn, Reveal } from '@/components/Reveal'
import { RevealImage } from '@/components/RevealImage'
import { journalEntries } from '@/content/site'
import type { JournalEntry } from '@/types/content'

function entryNumber(i: number) {
  return `No. ${String(i + 1).padStart(2, '0')}`
}

function Caption({ entry, i }: { entry: JournalEntry; i: number }) {
  return (
    <FadeIn delay={0.3} className="mt-3 grid grid-cols-[auto_1fr_auto] gap-3 label">
      <span className="text-grey-500">{entryNumber(i)}</span>
      <span>
        {entry.city} — {entry.title}
      </span>
      <span className="text-grey-500">{entry.date}</span>
    </FadeIn>
  )
}

/**
 * Japan Journal: impaginato come una rivista, a griglia ordinata.
 * Riga 1: copertina a tutta larghezza con il titolo sovrapposto.
 * Riga 2: scheda di testo + due foto verticali della stessa altezza.
 */
export function JapanTeaser() {
  const [cover, ...entries] = journalEntries

  return (
    <section id="japan" className="bg-paper px-page py-section" aria-labelledby="japan-title">
      <div className="flex items-baseline justify-between border-b border-ink pb-3 label">
        <span>(04) Journal</span>
        <span className="text-grey-500">
          Vol. 01 — {String(journalEntries.length).padStart(2, '0')} entries
        </span>
      </div>

      {cover && (
        <a href="#japan" className="mt-2 block" aria-label={`${cover.city} — ${cover.title}`}>
          <div className="relative">
            <RevealImage
              media={cover.cover}
              fill
              className="aspect-[4/5] md:aspect-[16/8] lg:aspect-[16/7]"
            />
            {/* Titolo sovrapposto alla copertina */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-t from-ink/55 via-transparent to-ink/30 p-4 text-paper md:p-6">
              <div className="flex justify-between label">
                <span>{entryNumber(0)}</span>
                <span>Cover story</span>
              </div>
              <h2 id="japan-title" className="text-display font-extrabold uppercase">
                <Reveal delay={0.4}>Japan</Reveal>
                <Reveal delay={0.5}>Journal</Reveal>
              </h2>
            </div>
          </div>
          <Caption entry={cover} i={0} />
        </a>
      )}

      <div className="mt-2 grid-page gap-y-10 md:mt-6 md:gap-y-2">
        {/* Scheda editoriale, alta quanto le foto accanto */}
        <FadeIn className="col-span-4 flex flex-col justify-between gap-12 border border-grey-200 bg-white p-5 md:col-span-6 lg:col-span-4">
          <div className="flex items-start justify-between">
            <p className="label">A visual diary</p>
            <p lang="ja" aria-hidden className="font-jp text-title leading-none font-bold">
              日本
            </p>
          </div>
          <div>
            <p className="max-w-[24ch] text-lead font-medium">
              Streets, details, quiet places and everyday life — Japan through my eyes.
            </p>
            <ul className="mt-8 border-t border-grey-200 label">
              {journalEntries.map((entry, i) => (
                <li
                  key={entry.slug}
                  className="flex justify-between gap-3 border-b border-grey-200 py-2"
                >
                  <span className="text-grey-500">{entryNumber(i)}</span>
                  <span className="flex-1">{entry.city}</span>
                  <span className="text-grey-500">{entry.date}</span>
                </li>
              ))}
            </ul>
            <a
              href="#japan"
              className="group mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 label"
            >
              Open the journal
              <span className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </FadeIn>

        {entries.map((entry, i) => (
          <a
            key={entry.slug}
            href="#japan"
            className="col-span-4 block md:col-span-3 lg:col-span-4"
            aria-label={`${entry.city} — ${entry.title}`}
          >
            <RevealImage media={entry.cover} delay={0.12 * (i + 1)} />
            <Caption entry={entry} i={i + 1} />
          </a>
        ))}
      </div>
    </section>
  )
}
