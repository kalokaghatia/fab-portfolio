/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Foto importate con `?responsive` (vite-imagetools, vedi vite.config.ts): WebP senza
 * metadati EXIF in più larghezze. `src`, `w` e `h` sono quelli dell'originale; `srcset`
 * manca se la foto è più stretta della larghezza minima.
 */
declare module '*?responsive' {
  const image: { src: string; w: number; h: number; srcset?: string }
  export default image
}
