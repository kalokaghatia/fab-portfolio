import type { AspectRatio, Media } from '@/types/content'
import { cn } from '@/utils/cn'

const aspectClass: Record<AspectRatio, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
  square: 'aspect-square',
  tall: 'aspect-[2/3]',
  slim: 'aspect-[3/5]',
}

const toneClass = {
  1: 'bg-grey-200 text-grey-600',
  2: 'bg-grey-300 text-grey-700',
  3: 'bg-grey-500 text-grey-100',
  4: 'bg-grey-800 text-grey-400',
} as const

interface MediaFrameProps {
  media: Media
  className?: string
  /** Numero mostrato sul segnaposto (es. "FIG. 03"). */
  index?: number
  /** Riempie il contenitore invece di usare il proprio aspect ratio. */
  fill?: boolean
  loading?: 'eager' | 'lazy'
  /**
   * Larghezza a cui viene mostrata l'immagine (attributo `sizes`, es. "(min-width: 48rem) 50vw, 100vw"):
   * serve al browser per scegliere dal `srcSet` la versione più leggera che basta.
   */
  sizes?: string
}

/**
 * Immagine editoriale. Senza `src` mostra un segnaposto neutro con le stesse
 * proporzioni della foto finale, così il layout resta identico quando arriva.
 */
export function MediaFrame({
  media,
  className,
  index,
  fill,
  loading = 'lazy',
  sizes,
}: MediaFrameProps) {
  const frame = cn(
    'relative overflow-hidden',
    !fill && aspectClass[media.aspect],
    // Il fondo carta serve al "moltiplica": la foto si fonde con questo colore.
    media.cutout && 'bg-paper',
    className,
  )

  if (media.src) {
    return (
      <div className={frame}>
        <img
          // sizes e srcSet prima di src: il browser sceglie la versione prima di iniziare a scaricare
          sizes={media.srcSet ? sizes : undefined}
          srcSet={media.srcSet}
          src={media.src}
          alt={media.alt}
          loading={loading}
          decoding="async"
          className={cn(
            'absolute inset-0 size-full',
            media.fit === 'contain' ? 'object-contain' : 'object-cover',
            media.cutout && 'mix-blend-multiply',
          )}
          style={media.focus ? { objectPosition: media.focus } : undefined}
        />
      </div>
    )
  }

  return (
    <div role="img" aria-label={media.alt} className={cn(frame, toneClass[media.tone ?? 2])}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_20%,rgb(255_255_255/0.18),transparent_60%)]"
      />
      <div aria-hidden className="absolute inset-x-3 top-3 flex justify-between label">
        <span>{index !== undefined ? `Fig. ${String(index).padStart(2, '0')}` : 'Fig.'}</span>
        <span className="hidden whitespace-nowrap sm:inline">Photo — to come</span>
      </div>
    </div>
  )
}
