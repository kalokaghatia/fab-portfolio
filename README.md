# site-vetrina

Base per un sito vetrina: React 19, TypeScript (strict), Vite, Tailwind CSS 4.

## Requisiti

- Node.js `^20.19.0 || >=22.12.0` (consigliata la LTS indicata in `.nvmrc`)
- npm

## Script

| Comando                | Descrizione                                 |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Server di sviluppo Vite                     |
| `npm run build`        | Type check + build di produzione in `dist/` |
| `npm run preview`      | Anteprima locale della build                |
| `npm run lint`         | ESLint                                      |
| `npm run format`       | Formatta con Prettier                       |
| `npm run format:check` | Verifica la formattazione                   |
| `npm run typecheck`    | Controllo TypeScript                        |
| `npm test`             | Vitest in watch mode                        |
| `npm run test:run`     | Vitest, esecuzione singola                  |

## Struttura

```
src/
  assets/      foto e immagini dei progetti (convertite in WebP in build)
  components/  elementi riutilizzabili (MediaFrame, Reveal, RevealImage, ProjectLink, Wordmark)
  content/     testi e dati del sito (segnaposto da sostituire)
  hooks/       hook React (useMediaQuery, useFinePointer, usePathname)
  layouts/     header, menu mobile, footer
  lib/         preset di animazione e router minimo (History API)
  pages/       pagina di un progetto, aperta sopra la homepage
  sections/    sezioni della homepage
  styles/      design tokens e CSS globali (Tailwind)
  test/        setup di Vitest e Testing Library
  types/       modello dei contenuti e tipi globali
  utils/       funzioni di utilità
```

Sistema visivo: vedi `DESIGN.md`. Alias `@/` → `src/`.

## Immagini

Importa le foto con `?format=webp&as=img` (es. `import img from '@/assets/foto.jpg?format=webp&as=img'`)
e passale a `image()` in `src/content/site.ts`: [vite-imagetools](https://github.com/JonasKruckenberg/imagetools)
le converte in WebP, rimuove i metadati EXIF e fornisce larghezza e altezza.

## Variabili d'ambiente

Al momento il sito non ne usa. Se servono, aggiungile a `.env.example` e copialo in `.env.local`:
solo le variabili `VITE_*` arrivano al browser, quindi non inserire segreti.

## Fine riga

`.gitattributes` impone LF su tutti i file di testo, come si aspetta Prettier. Su una copia
clonata prima di questa regola, `npm run format` converte i file esistenti.

## Deploy

Build statica compatibile con Netlify e Vercel (rilevamento automatico di Vite):

- comando di build: `npm run build`
- cartella di output: `dist`
