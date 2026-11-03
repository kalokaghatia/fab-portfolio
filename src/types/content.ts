/**
 * Modello dei contenuti. Oggi i dati vivono in `src/content/`, domani arriveranno
 * da un CMS con la stessa forma: i componenti non dovranno cambiare.
 */

export type AspectRatio = 'portrait' | 'landscape' | 'square' | 'tall' | 'slim'

/** Immagine reale (src valorizzato) oppure segnaposto in attesa della foto. */
export interface Media {
  src?: string
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
  /** Nella pagina del progetto occupa tutta la riga (es. mockup orizzontali). */
  wide?: boolean
}

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  /** Nome utente mostrato accanto al social, es. "@fabianaruotolo". */
  handle?: string
  /** null = contatto non ancora fornito: viene mostrato come segnaposto. */
  href: string | null
}

export type ProjectCategory =
  'Graphic Design' | 'Content Creation' | 'Art Direction' | 'Photography'

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  /** Altre discipline toccate dal progetto: compare anche sotto questi filtri. */
  alsoIn?: ProjectCategory[]
  /** Tipo di lavoro, mostrato sotto il titolo in galleria (es. "Brand identity"). */
  discipline: string
  /** Una riga che racconta il progetto, sotto il titolo nella sua pagina. */
  subtitle: string
  /** Testo del progetto: il primo paragrafo è l'attacco, in grande. */
  description: string[]
  cover: Media
  /** Altre immagini mostrate nella pagina del progetto, dopo la copertina. */
  gallery?: Media[]
  /* Campi facoltativi: nella pagina compaiono solo se compilati. */
  context?: string
  deliverables?: string
  credits?: string
  link?: { label: string; href: string }
}

/** Uno scatto della sezione "Through my eyes", con la sua frase. */
export interface Frame {
  photo: Media
  caption: string
}

/** Un capitolo del Japan Journal: una città con i suoi scatti. */
export interface JapanCity {
  slug: string
  name: string
  /** Nome in giapponese, mostrato come segno grafico. */
  kanji: string
  /** Una riga che racconta la tappa. */
  note: string
  /** Coordinate del centro città, come su un biglietto di viaggio. */
  coordinates: string
  /** Vuoto = foto in arrivo: la pagina mostra dei segnaposto. */
  photos: Media[]
}

/** true se il progetto appartiene alla categoria (principale o secondaria). */
export function inCategory(project: Project, category: ProjectCategory) {
  return project.category === category || (project.alsoIn?.includes(category) ?? false)
}
