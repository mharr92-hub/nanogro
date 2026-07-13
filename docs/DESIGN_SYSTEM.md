# Sistema de diseño — Nano-Gro Case Intelligence Platform

Fase 1 del rediseño. Rama `redesign/v2`.

Fuente de los tokens: [tailwind.config.ts](../tailwind.config.ts) y [app/globals.css](../app/globals.css).
Componentes: [components/ui/](../components/ui/).

---

## 1. La tesis del diseño

La plataforma no vende un producto: **acredita evidencia**. Todo el sistema visual sale de esa
distinción. Una landing de agroquímicos grita un beneficio; un sistema de evidencia **muestra el
dato y admite lo que no sabe**. Por eso:

- El dato manda. Cada cifra vive en una fuente monoespaciada de cifras tabulares, alineada en
  columna, como la lectura de un instrumento.
- El color se gana. El verde es la **acción** (marca, botones), no la decoración. El dato medido y la
  verificación tienen su **propio color de laboratorio**, un azul-teal profundo que nunca se usa para
  vender nada. Eso separa visualmente "lo que Nano-Gro te propone" de "lo que el campo midió".
- La ausencia de dato se dice. `Sin datos` / `No reportado` es una salida de primera clase en todos
  los componentes. Ninguno imprime un cero cuando lo que hay es un hueco.

Lo que evitamos deliberadamente, por indicación del brief: el verde-genérico-agro, la plantilla
crema + serif + terracota, y el look SaaS oscuro con verde ácido. El sitio anterior era exactamente
lo primero (`#2f7d4d` en claro, `#55ff9a` neón en oscuro).

---

## 2. Color

Seis tokens con nombre y propósito, tomados del mundo real del producto: **suelo, hoja, campo,
laboratorio**.

| Nombre | Token CSS | Claro | Oscuro | Propósito |
| --- | --- | --- | --- | --- |
| **field** | `--background` | `#f4f5f1` | `#101311` | El papel sobre el que se lee la evidencia. |
| **sheet** | `--card` | `#ffffff` | `#171b18` | La superficie de la ficha y de las tarjetas. |
| **soil** | `--foreground` | `#171a16` | `#eceee8` | La tinta. Negro con calidez de suelo, no gris frío. |
| **leaf** | `--primary` | `#14523a` | `#6fc79a` | **La acción**: marca, botones primarios, enlaces. Verde botánico profundo, no verde agro. |
| **assay** | `--data` | `#0a5a73` | `#66bcd8` | **El dato medido y la verificación.** Color de laboratorio. Reservado a cifras, scores, barras y sellos. |
| **husk** | `--warning` | `#8a5a00` | `#e0a44a` | Advertencia y dato pendiente de confirmación. `--danger` para el error. |

Tokens de soporte: `--muted` / `--muted-foreground` (jerarquía secundaria), `--accent` (tinte de
hoja para fondos de insignia), `--data-tint` (tinte de laboratorio), `--border`, `--grid-line` (la
retícula tenue de la ficha).

**La regla que sostiene el sistema:** `--data` nunca se usa en un CTA, y `--primary` nunca se usa en
una cifra. Si un número aparece en verde, el diseño está mintiendo sobre qué es una medición y qué
es una propuesta comercial.

### Niveles de evidencia A/B/C/D

Cada nivel tiene color semántico propio (`--level-a` … `--level-d`), y es el color que pinta la
franja superior de la Ficha de Evidencia:

| Nivel | Color | Significado (spec, sección 6) |
| --- | --- | --- |
| **A** | leaf | Datos productivos completos, fotos antes/después, mediciones y validación técnica. |
| **B** | assay | Datos productivos parciales más evidencia visual. |
| **C** | husk | Testimonio documentado con algo de contexto de soporte. |
| **D** | muted | Caso anecdótico o nota de campo temprana. Útil como referencia, débil como prueba pública. |

Un nivel D se ve gris y honesto. No se maquilla.

### Contraste

Todos los pares texto/fondo se eligieron para superar AA (4.5:1 en texto normal). En claro,
`--foreground` sobre `--background` da ~15:1; `--data` sobre blanco ~6.3:1; `--primary` sobre blanco
~8.9:1; `--muted-foreground` sobre `--background` ~5.6:1. El `--warning` en claro es `#8a5a00`
(ámbar oscuro) y no el ámbar brillante habitual, precisamente para pasar AA sobre papel.

---

## 3. Tipografía

Tres familias, cargadas con `next/font/google` (auto-hospedadas, sin petición a un tercero, sin CLS):

| Rol | Fuente | Variable | Uso |
| --- | --- | --- | --- |
| **Display** | Bricolage Grotesque | `--font-display` | Titulares `h1`/`h2` y la firma de la ficha. **Con moderación.** Tiene carácter; usada en todas partes, cansa. |
| **Cuerpo** | Inter | `--font-body` | Todo el texto corrido. Elegida por legibilidad a 360px, no por personalidad. |
| **Datos** | IBM Plex Mono | `--font-data` | **Toda cifra**: ROI, %, hectáreas, scores, `public_id`. Cifras tabulares (`tnum`), se alinean en columna. |

Se aplican con la clase `.tabular`, que además fija `font-variant-numeric: tabular-nums`. La regla es
absoluta: **si es un número que el usuario puede comparar con otro número, va en `.tabular`.**

### Escala

Definida en `theme.extend.fontSize`, con interlineado y peso intencionales en cada escalón:

`display-lg` (60px) · `display` (44px) · `h1` (34px) · `h2` (28px) · `h3` (22px) · `h4` (18px) ·
`h5` (16px) · `body-lg` (18px) · `body` (16px) · `label` (13px) · `caption` (12px)

Y dos escalones exclusivos de cifras: `metric` (28px) y `metric-lg` (40px).

Mobile-first: `display-lg` solo aparece a partir de `md`. En 360px el titular mayor es `display`.
El `font-black` indiscriminado del sitio anterior desaparece: el peso máximo del sistema es 600–700.

---

## 4. Espaciado, radios, breakpoints

- **Ritmo:** múltiplos de 4. Los saltos permitidos entre bloques son `gap-3` (12px, dentro de un
  componente), `gap-5` (20px, entre tarjetas de una grilla) y `gap-8` (32px, entre secciones).
- **`.section`:** `40px` de padding vertical en móvil, `64px` desde `md`. Antes era `64px` fijo, y
  en un teléfono eso es un tercio de la pantalla en blanco.
- **`.container`:** gutter de `16px` en móvil, `24px` desde `md`. Antes era `32px` fijo.
- **Radios:** `4px` para la ficha (documento, esquinas casi rectas), `6px` para controles, `10px`
  para tarjetas, `999px` para chips e insignias.
- **Breakpoints:** se añade `xs: 380px`. Las grillas ahora escalan `1 → sm:2 → lg:3`, sin el salto
  brusco de 1 a 3 columnas que tenía el sitio.
- **Objetivo táctil:** `min-height: 44px` en `.btn` y `.input`, y en el chip de filtro. No negociable.

---

## 5. El elemento firma: la Ficha de Evidencia

[components/ui/EvidenceSheet.tsx](../components/ui/EvidenceSheet.tsx)

Es la propuesta que hace reconocible la plataforma. Un panel con estética de **ficha técnica de
laboratorio verificada**:

```
┌───────────────────────────────────────────────┐  ← franja del color del nivel de evidencia
│ FICHA DE EVIDENCIA  NG-2026-014     [Nivel A] │  ← id del caso en cifra monoespaciada
│                                                │
│ Cacao en Panamá: +27% tras baja producción     │  ← titular en fuente display
│ ─────────────────────────────────────────────  │
│ CULTIVO      PAÍS         PROBLEMA             │
│ Cacao        Panamá       Baja producción      │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  ← línea de corte, como un formulario
│ RESULTADO    ROI          CONFIANZA            │
│ +27%         5.3x         82/100               │  ← cifras tabulares; verde=resultado, azul=dato
└───────────────────────────────────────────────┘
```

Detalles deliberados:

- **La franja superior lleva el color del nivel de evidencia.** Un caso A se corona de verde; uno D,
  de gris. El nivel se ve antes de leer una palabra.
- **Retícula de fondo tenue** (`--grid-line`, líneas cada 28px) que evoca papel milimetrado. Es lo
  que hace que la ficha se lea como documento y no como tarjeta de marketing.
- **Sin sombra difusa y con esquinas casi rectas** (`4px`), al contrario que `.card` (`10px`, con
  sombra). La ficha se distingue de una tarjeta cualquiera a un metro de distancia.
- **Siete campos, siempre los mismos, siempre en el mismo sitio.** Cultivo, país, problema, resultado,
  ROI, nivel de evidencia y confianza. La repetición es el punto: el agricultor aprende a leerla una
  vez y luego la escanea en dos segundos.

Se reutiliza en cuatro sitios con dos variantes:

| Dónde | Variante |
| --- | --- |
| Tarjeta en listados, home, hubs | `compact` (titular enlazado + botón "Ver caso") |
| Cabecera del detalle de caso | `full` (titular `h1`, nivel con nombre, sin botón) |
| Resultado del diagnóstico | `compact` con `reasons` (razón del match) |
| Comparador (Fase 2) | `compact` |

---

## 6. Componentes base

Todos son **componentes de servidor** y reciben `messages` por prop, siguiendo el patrón i18n que ya
usaba el proyecto. Ninguno necesita JavaScript en el cliente.

| Componente | Qué resuelve |
| --- | --- |
| `Button` / `ButtonLink` | Variantes `primary` · `secondary` · `ghost` · **`whatsapp`** (canal real de venta agrícola, merece su color). Alturas táctiles de 44px. |
| `Card` / `CardHeader` | La superficie genérica. Reemplaza los cuatro paddings distintos que convivían. |
| `Badge` / `EvidenceLevelBadge` | El nivel A/B/C/D **nunca aparece desnudo**: el badge lleva su descripción en `title` + `aria-label`, así que se explica al pasar el ratón y para un lector de pantalla. |
| `MetricStat` | **La representación canónica de un número.** Sustituye los tres componentes `Metric` distintos que había. Acepta `sampleSize` e imprime `n = 12`. Sin dato, dice `Sin datos`. |
| `ConfidenceScore` | Score 0-100 + barra + **checklist de evidencia desplegable** (`<details>`, sin JS). Cumple la exigencia de la spec de que el usuario entienda *por qué* un caso es fuerte o incompleto. Lleva su disclaimer pegado. |
| `FilterChip` | Chip de faceta con contador. Un contador en cero se atenúa, no se oculta. |
| `Skeleton` / `EvidenceSheetSkeleton` / `SheetGridSkeleton` | Para los `loading.tsx` que la app no tenía. |
| `EmptyState` | Vacío **con salida obligatoria**: título, cuerpo y acción. |
| `Stepper` | Progreso del diagnóstico. `role="progressbar"` con sus `aria-value*`. |
| `EvidenceSheet` | La firma. Ver arriba. |

---

## 7. El checklist de evidencia

[lib/evidence-checklist.ts](../lib/evidence-checklist.ts)

Ocho items que se derivan **solo de lo que el esquema puede probar**:

datos productivos medidos · ROI calculado · fotos antes/después · registro fotográfico ·
video de seguimiento · informe técnico o de laboratorio · testimonio con consentimiento aprobado ·
revisión agronómica

La spec contempla además `has_control_group`, pero la base de datos **no tiene esa columna**. Se
omite en lugar de inventarla. Un sistema de evidencia que rellena huecos con suposiciones no es un
sistema de evidencia.

### Un bug corregido de paso

`calculateEvidenceScore` daba el bono de +10 por "consentimiento completo" a un array **vacío** de
evidencias, porque `[].every(...)` es `true` en JavaScript. Un caso sin una sola foto puntuaba por
tener el consentimiento en regla. Al hacer visible el checklist, la incoherencia habría quedado a la
vista del usuario, así que está arreglado en [lib/scoring.ts](../lib/scoring.ts): el bono ahora exige
`evidence.length > 0`.

**Consecuencia a tener en cuenta:** los `evidence_score` ya guardados en la base para casos sin
evidencia están inflados en 10 puntos. Se recalculan solos la próxima vez que se guarde cada caso
desde el admin. Si quieres, en la Fase 5 puedo añadir un script de recálculo masivo.

---

## 8. Reglas de uso (resumen operativo)

1. Toda cifra comparable lleva `.tabular`.
2. `--data` para lo medido; `--primary` para lo accionable. Nunca al revés.
3. Toda métrica agregada lleva su `sampleSize`.
4. Ningún nivel de evidencia sin su descripción accesible.
5. Ningún estado vacío sin una salida.
6. Ningún control por debajo de 44px de alto.
7. Se diseña a 360px primero; los escalones `sm`/`lg` añaden, no rescatan.
