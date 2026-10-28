# FAB. — Sistema visivo

Principio guida: **meno elementi, più carattere.** Una rivista di fotografia e design, non un template.

## Palette

Rigorosamente bianco e nero, con grigi neutri (nessuna tinta). Token in `src/styles/index.css`.

| Token          | Valore    | Uso                                         |
| -------------- | --------- | ------------------------------------------- |
| `ink`          | `#0b0b0b` | Testo, sezioni scure                        |
| `paper`        | `#f5f5f4` | Fondo principale (bianco carta, non ottico) |
| `grey-100…900` | neutri    | Linee, testi secondari, segnaposto foto     |

Le sezioni alternano chiaro/scuro: Hero, About e Work su `paper`; Photography su `ink`; Japan su `paper`; Contact e footer su `ink`.
L'header usa `mix-blend-difference`, quindi resta leggibile su entrambi i fondi.

## Tipografia

Un solo font: **Inter Tight** (variabile 100–900, self-hosted con `@fontsource-variable`).
È un grottesco svizzero stretto: regge sia i titoli enormi sia i microtesti.
Per i dettagli giapponesi: `font-jp` (Hiragino / Noto Sans JP di sistema).

| Classe         | Dimensione                | Interlinea | Tracking | Uso                           |
| -------------- | ------------------------- | ---------- | -------- | ----------------------------- |
| logo `FAB.`    | `48.2cqw` (contenitore)   | 0.8        | −0.03em  | Hero e footer, a tutta pagina |
| `text-display` | 60px → 224px (`clamp`)    | 0.82       | −0.06em  | Titoli di sezione             |
| `text-title`   | 44px → 120px              | 0.9        | −0.045em | Titoli secondari              |
| `text-lead`    | 22px → 40px               | 1.12       | −0.025em | Frasi d'apertura, email       |
| `text-body`    | 16px                      | 1.5        | —        | Testo corrente                |
| `text-small`   | 13px                      | 1.4        | —        | Note, didascalie lunghe       |
| `label`        | 11px, maiuscolo, peso 500 | 1.25       | +0.06em  | Microtesti editoriali, menu   |

Pesi: 800 per il display, 600–700 per i titoli, 500 per le label. Il contrasto nasce
dalla distanza tra `label` e `text-display`, non dal colore.

## Griglia e spaziature

- `grid-page`: 4 colonne (mobile) · 6 (≥768px) · 12 (≥1024px); gutter 12 → 24px.
- `px-page`: margine laterale 16 → 40px.
- `py-section`: respiro verticale 80 → 176px.
- Composizioni asimmetriche: gli elementi partono da colonne diverse (`col-start-*`) e
  vengono sfalsati in verticale (`mt-*`), ma restano sempre agganciati alla griglia.

## Immagini

- Formati: `portrait` 4:5 · `landscape` 3:2 · `square` 1:1 · `tall` 2:3 · `slim` 3:5.
- Le foto si importano con `?format=webp&as=img` (vedi `src/content/site.ts`): in build
  diventano WebP senza metadati EXIF e portano con sé le dimensioni originali.
- `MediaFrame` mostra la foto, o un segnaposto grigio con le stesse proporzioni
  ("Fig. 03 — Photo to come"), così il layout non cambia quando arrivano i file.

## Movimento

- Una sola curva: `cubic-bezier(0.22, 1, 0.36, 1)`, durate 0.5–1.1s. Nessun rimbalzo.
- Titoli che emergono da una maschera (`Reveal`), immagini in dissolvenza (`FadeIn`).
- Hero: pila di foto sopra il logo; su desktop cambia con la posizione del mouse e segue il
  cursore, su touch scorre da sola.
- Parallasse leggera allo scroll (logo e pila foto della hero, nastro Photography, scritta WORK).
- Con "riduci movimento" restano solo le dissolvenze:
  - `MotionConfig reducedMotion="user"` rende istantanee le animazioni di spostamento;
  - le parallassi restano ferme (`useReducedMotion` nei componenti) e il nastro Photography
    si sfoglia di lato;
  - pagina progetto e menu mobile compaiono in dissolvenza invece che a tendina;
  - la pila hero non scorre in automatico.
- La galleria Selected Work su desktop scorre in orizzontale anche con "riduci movimento":
  è il modo stesso di sfogliarla.
