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
  components/  elementi riutilizzabili (MediaFrame, Reveal)
  content/     testi e dati del sito (segnaposto da sostituire)
  hooks/       hook React (useFinePointer)
  layouts/     header, menu mobile, footer
  lib/         preset di animazione condivisi
  sections/    sezioni della homepage
  styles/      design tokens e CSS globali (Tailwind)
  test/        setup di Vitest e Testing Library
  types/       modello dei contenuti e tipi globali
  utils/       funzioni di utilità
```

Sistema visivo: vedi `DESIGN.md`. Alias `@/` → `src/`.

## Variabili d'ambiente

Copia `.env.example` in `.env.local`. Solo le variabili `VITE_*` arrivano al browser: non inserire segreti.

## Deploy

Build statica compatibile con Netlify e Vercel (rilevamento automatico di Vite):

- comando di build: `npm run build`
- cartella di output: `dist`
