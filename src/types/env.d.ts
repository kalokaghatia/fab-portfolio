/// <reference types="vite/client" />

/**
 * Immagini importate con `?format=webp&as=img` (vite-imagetools): convertite in WebP
 * in fase di build, senza metadati EXIF, con le dimensioni in pixel dell'originale.
 */
declare module '*as=img' {
  const image: { src: string; w: number; h: number }
  export default image
}
