/**
 * Modello dei contenuti. Oggi i dati vivono in `src/content/`, domani arriveranno
 * da un CMS con la stessa forma: i componenti non dovranno cambiare.
 */

export type AspectRatio = 'portrait' | 'landscape' | 'square' | 'tall' | 'slim'

/** Immagine reale (src valorizzato) oppure segnaposto in attesa della foto. */
export interface Media {
  src?: string
  /** Versioni in più larghezze (formato `srcset`): il browser sceglie quella adatta allo spazio. */
  srcSet?: string
  /** Dimensioni in pixel dell'originale: riservano lo spazio prima che l'immagine carichi. */
  width?: number
  height?: number
  alt: string
  aspect: AspectRatio
  /**
   * Oggetto fotografato su fondo bianco (mockup): il bianco si fonde con lo sfondo
   * della pagina (mix-blend-mode: multiply), come se fosse un PNG scontornato.
   */
  cutout?: boolean
  /** "contain" mostra l'immagine intera nella cornice (es. PNG scontornati), senza ritagli. */
  fit?: 'cover' | 'contain'
  /** Punto focale per i ritagli (CSS object-position), es. "50% 40%". */
  focus?: string
  /** Tono di grigio del segnaposto, da 1 (chiaro) a 4 (scuro). */
  tone?: 1 | 2 | 3 | 4
}

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  /** null = contatto non ancora fornito: viene mostrato come segnaposto. */
  href: string | null
}

export type ProjectCategory =
  'Graphic Design' | 'Content Creation' | 'Art Direction' | 'Photography'

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  year: string
  cover: Media
  /** Altre immagini mostrate nella pagina del progetto, dopo la copertina. */
  gallery?: Media[]
  /* Campi facoltativi: nella pagina compaiono solo se compilati. */
  client?: string
  role?: string
  description?: string
}

export interface PhotoCollection {
  slug: string
  title: string
  cover: Media
}

export interface JournalEntry {
  slug: string
  title: string
  city: string
  date: string
  cover: Media
}
