import portraitImg from '@/assets/photos/fab-portrait.jpg?format=webp&as=img'
import viaggioBookImg from '@/assets/projects/il-viaggio-per-amarsi/book-spread.png?format=webp&as=img'
import viaggioMirrorImg from '@/assets/projects/il-viaggio-per-amarsi/poster-amati.png?format=webp&as=img'
import viaggioPosterImg from '@/assets/projects/il-viaggio-per-amarsi/poster-amare-se-stessi.png?format=webp&as=img'
import loackerPouchImg from '@/assets/projects/loacker-quadratini/pouch.png?format=webp&as=img'
import cityNightImg from '@/assets/photos/japan-city-night.jpg?format=webp&as=img'
import sakeBarrelsImg from '@/assets/photos/japan-sake-barrels.jpg?format=webp&as=img'
import shinjukuNightImg from '@/assets/photos/japan-shinjuku-night.jpg?format=webp&as=img'
import type {
  JournalEntry,
  Media,
  NavItem,
  PhotoCollection,
  Project,
  ProjectCategory,
  SocialLink,
} from '@/types/content'

/*
 * Contenuti della homepage.
 * Tutto ciò che è tra [parentesi quadre] o con src assente è un SEGNAPOSTO
 * da sostituire con materiale reale: nessun dato è stato inventato.
 *
 * Le foto si importano con `?format=webp&as=img`: in build diventano WebP leggeri
 * e portano con sé le dimensioni originali (vedi `image()` qui sotto).
 */

/** Sorgente e dimensioni di una foto importata, nella forma di `Media`. */
function image({ src, w, h }: { src: string; w: number; h: number }) {
  return { src, width: w, height: h }
}

export const site = {
  name: 'FAB.',
  role: ['Content Creator', '& Graphic Designer'],
  year: new Date().getFullYear(),
} as const

export const navigation: NavItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Photography', href: '#photography' },
  { label: 'Japan', href: '#japan' },
  { label: 'Contact', href: '#contact' },
]

export const contact = {
  /** Da compilare: finché è null la homepage mostra un segnaposto. */
  email: 'artoffabb@gmail.com' as string | null,
  socials: [
    { label: 'Instagram', href: null },
    { label: 'LinkedIn', href: null },
  ] satisfies SocialLink[],
}

/* Bozza ricavata dal brief: da rivedere con parole tue. */
export const intro = {
  heading: 'Hi, I’m Fab.',
  statement:
    'I make content and design visuals. Mostly, I look closely — at places, people and the small details most people walk past.',
  note: 'Photography, design and a long-running love for Japan shape the way I work.',
  disciplines: ['Content Creation', 'Graphic Design', 'Art Direction', 'Photography'],
  marquee: ['Content', 'Design', 'Photography', 'Japan', 'Travel'],
}

export const heroPhotos: Media[] = [
  { alt: '[Foto hero 01]', aspect: 'portrait', tone: 2 },
  { alt: '[Foto hero 02]', aspect: 'portrait', tone: 3 },
  { alt: '[Foto hero 03]', aspect: 'portrait', tone: 1 },
  { alt: '[Foto hero 04]', aspect: 'portrait', tone: 4 },
  { alt: '[Foto hero 05]', aspect: 'portrait', tone: 2 },
]

export const portrait: Media = {
  ...image(portraitImg),
  alt: 'Black and white studio portrait of Fab in a black turtleneck, hand resting on her cheek',
  aspect: 'portrait',
}

export const projectCategories: ('All' | ProjectCategory)[] = [
  'All',
  'Graphic Design',
  'Content Creation',
  'Art Direction',
  'Photography',
]

export const projects: Project[] = [
  {
    slug: 'il-viaggio-per-amarsi',
    title: 'Il viaggio per amarsi',
    category: 'Graphic Design',
    year: '[Year]',
    cover: {
      ...image(viaggioPosterImg),
      fit: 'contain',
      alt: 'Pink poster with a black and white illustration of a woman hugging herself: "Amare se stessi è l’inizio di una storia d’amore lunga tutta la vita"',
      aspect: 'portrait',
    },
    gallery: [
      {
        ...image(viaggioBookImg),
        fit: 'contain',
        alt: 'Folded poster with the book cover "Il viaggio per amarsi" and its inside pages',
        aspect: 'portrait',
      },
      {
        ...image(viaggioMirrorImg),
        fit: 'contain',
        alt: 'Pink poster of a woman looking at herself in a hand mirror: "Amati. Guardati allo specchio e impara ad apprezzarti"',
        aspect: 'portrait',
      },
    ],
  },
  {
    slug: 'loacker-quadratini',
    title: 'Loacker Quadratini',
    category: 'Graphic Design',
    year: '[Year]',
    cover: {
      ...image(loackerPouchImg),
      fit: 'contain',
      alt: 'Red and gold stand-up pouch for Loacker Quadratini Napolitaner hazelnut wafers, 250 g',
      aspect: 'portrait',
    },
  },
  {
    slug: 'project-03',
    title: '[Project title]',
    category: 'Art Direction',
    year: '[Year]',
    cover: { alt: '[Cover progetto 03]', aspect: 'portrait', tone: 1 },
  },
  {
    slug: 'project-04',
    title: '[Project title]',
    category: 'Photography',
    year: '[Year]',
    cover: { alt: '[Cover progetto 04]', aspect: 'landscape', tone: 3 },
  },
]

export const photoCollections: PhotoCollection[] = [
  { slug: 'people', title: 'People', cover: { alt: '[People]', aspect: 'portrait', tone: 3 } },
  { slug: 'places', title: 'Places', cover: { alt: '[Places]', aspect: 'landscape', tone: 2 } },
  { slug: 'details', title: 'Details', cover: { alt: '[Details]', aspect: 'square', tone: 4 } },
  { slug: 'travel', title: 'Travel', cover: { alt: '[Travel]', aspect: 'portrait', tone: 1 } },
  {
    slug: 'everyday',
    title: 'Everyday',
    cover: { alt: '[Everyday]', aspect: 'landscape', tone: 3 },
  },
]

/* La prima voce è quella in copertina, a tutta larghezza. */
export const journalEntries: JournalEntry[] = [
  {
    slug: 'entry-01',
    title: '[Entry title]',
    city: '[City]',
    date: '[Month Year]',
    cover: {
      ...image(cityNightImg),
      alt: 'Aerial view of a city at night, an orange-lit highway winding between skyscrapers',
      aspect: 'tall',
      focus: '50% 62%',
    },
  },
  {
    slug: 'entry-02',
    title: '[Entry title]',
    city: '[City]',
    date: '[Month Year]',
    cover: {
      ...image(sakeBarrelsImg),
      alt: 'Wall of painted sake barrels with Japanese calligraphy',
      aspect: 'portrait',
    },
  },
  {
    slug: 'entry-03',
    title: '[Entry title]',
    city: '[City]',
    date: '[Month Year]',
    cover: {
      ...image(shinjukuNightImg),
      alt: 'Crowded street at night lined with glowing neon signs',
      aspect: 'portrait',
      focus: '50% 60%',
    },
  },
]
