# Auditoría de rediseño — Nano-Gro Case Intelligence Platform

Fecha: 2026-07-13 · Rama: `redesign/v2` · Línea base: `npm run build` pasa sin errores.

Documento producido en la Fase 0 del rediseño. Compara el estado real del código con
`NANO_GRO_CASE_INTELLIGENCE_PLATFORM_SPEC.md` (fuente de verdad) y
`NANO_GRO_48H_CASE_INGESTION_MVP.md`. Nada se implementa hasta aprobar este audit.

> Nota de alcance: la carpeta `nano-gro-platform/` es un prototipo anterior e independiente
> (Prisma + Meilisearch + rutas `/[lang]/case-studies`). **No se toca en este rediseño.** La
> aplicación viva es la raíz del repo (Next 15 App Router + Supabase).

---

## 1. Inventario de rutas actuales vs. sitemap de la spec (sección 4)

### 1.1 Rutas públicas que existen hoy

| Ruta actual | Renderiza | Equivalente en la spec | Estado |
| --- | --- | --- | --- |
| `/` | Hero + `SearchFilters` + 3 casos destacados (54 líneas) | `/` | Existe, muy por debajo del wireframe |
| `/cases` | Filtros + grid de casos | `/case-studies` | Existe, **ruta con nombre distinto** |
| `/cases/[slug]` | Detalle de caso (158 líneas) | `/case-studies/[case-slug]` | Existe, **ruta con nombre distinto** |
| `/crops`, `/crops/[slug]` | Lista de tiles + grid de casos | `/crops`, `/crops/[crop]` | Existe, es un listado fino, no un hub |
| `/countries`, `/countries/[slug]` | Idem | `/countries/[country]` | Idem |
| `/problems`, `/problems/[slug]` | Idem | `/problems/[problem]` | Idem |
| `/diagnostico` | Página estática + `LeadForm` de una pantalla | `/diagnostic` | Existe, **no es un stepper** |
| `/fichas`, `/fichas/[id]` | Fichas técnicas desde datos estáticos | *(no está en la spec)* | Extra fuera de spec |
| `/sitemap.xml`, `/robots.txt` | Sitemap con pares EN/ES hardcodeados | sección 14 | Existe, incompleto |

El *locale* no vive en el árbol de rutas: `middleware.ts` reescribe `/es/casos/...` → `/cases/...`
y fija la cabecera `x-nano-gro-locale`. Es una decisión que hay que respetar en el rediseño.

### 1.2 Rutas públicas que la spec pide y **no existen**

Ordenadas por impacto comercial (la spec define el embudo `Ver caso → Casos similares → Rango de ROI → Diagnóstico gratuito`):

| Ruta faltante | Sección de la spec | Por qué importa |
| --- | --- | --- |
| `/roi-calculator` (+ `/roi-calculator/[crop]`) | 5, 26 | Es el paso 3 del embudo de conversión más valioso. **No existe nada.** |
| `/before-after` (+ `/before-after/[crop]`) | 5, 26 | "Muchos visitantes confían en imágenes antes de leer narrativas largas". No existe. |
| `/case-studies/compare` | 4, 5 | Guardar y comparar hasta 3 casos. No existe. |
| `/results`, `/results/yield-increase`, `/results/roi`, `/results/disease-reduction` | 4, 5 | Hub de resultados agregados. No existe. |
| `/crops/[crop]/[problem]`, `/countries/[country]/[crop]`, `/problems/[problem]/[crop]` | 14 | SEO programático. No existe ninguna ruta de 2 niveles. |
| `/diagnostic/report/[report-id]` | 4, 12 | El informe descargable del diagnóstico. No existe. |
| `/become-distributor`, `/contact`, `/consultation`, `/product` | 4, 5 | Bloques de conversión. No existen. |
| `/knowledge`, `/research`, `/videos` | 4 | Fase posterior; no bloquean el MVP. |

**Índice de resultados agregados (sección "Aggregate Results Index"): no existe en absoluto.**
La home no muestra ni una sola métrica agregada, y por tanto tampoco muestra tamaños de muestra.
Es la brecha más grave respecto de la spec, porque es simultáneamente la promesa del producto
("Google de resultados Nano-Gro") y el punto donde la spec impone sus guardrails más estrictos.

### 1.3 Admin

El admin cubre razonablemente el MVP de 48h (dashboard, casos, importación CSV, evidencia,
taxonomía, cola de revisión, leads). No es el foco de este rediseño y **no se toca** más allá de
reutilizar los componentes base nuevos donde sea gratis hacerlo.

---

## 2. Brechas contra las reglas de producto de la spec

Estas no son deudas estéticas: son incumplimientos de reglas explícitas.

1. **Nivel de evidencia A/B/C/D casi invisible.** La spec (sección 6) dice: *"The public case page
   should display the final score and the evidence checklist so users understand why a case is
   strong or incomplete."* Hoy `confidence_score` se calcula en `lib/scoring.ts` y se muestra como
   un número suelto, **sin el checklist de evidencia que lo explica**. El usuario ve un "72/100" que
   no puede interpretar.

2. **Casos similares sin razón de match visible en la lógica correcta.** `lib/related.ts` sí produce
   `reasons[]`, pero en inglés y hardcodeadas, y la página las traduce con un mapa ES incrustado en
   [app/cases/[slug]/page.tsx:145-157](app/cases/[slug]/page.tsx#L145-L157). La spec exige que
   *"The engine should always show why each case is recommended"*. Funciona por accidente, no por diseño.

3. **El diagnóstico no entrega valor antes de vender.** La spec (sección 12) exige que al enviar, el
   usuario reciba *casos similares, categoría probable del problema y recomendación preliminar*. Hoy
   `submitLead` en [lib/actions.ts:367-433](lib/actions.ts#L367-L433) hace `redirect()` a `wa.me/...`:
   el usuario **sale del sitio** y no recibe nada. Efecto colateral: el estado de éxito en
   [app/diagnostico/page.tsx:46-52](app/diagnostico/page.tsx#L46-L52) que depende de `?submitted=1`
   es **código muerto** — esa rama nunca se ejecuta.

4. **El diagnóstico es un formulario, no un stepper.** La spec pide 8 pasos con barra de progreso
   (País → Cultivo → Hectáreas → Problema → Producción actual → Objetivo → WhatsApp → Email). Hoy es
   una sola pantalla con `LeadForm`, que además recibe `crops`/`countries`/`problems` como props y
   **nunca los usa** ([components/LeadForm.tsx:5-16](components/LeadForm.tsx#L5-L16)): el usuario
   escribe cultivo y país como texto libre, así que el lead entra sin normalizar contra la taxonomía.

5. **Sin calculador de ROI.** El paso "Ver rango de ROI" del embudo estrella simplemente no existe.

6. **Sin galería antes/después.** Solo hay una imagen en toda la aplicación
   ([app/cases/[slug]/page.tsx:106](app/cases/[slug]/page.tsx#L106)), con `<img>` crudo.

7. **`alt_text` se captura pero no se renderiza.** El admin lo pide
   ([app/admin/evidence/page.tsx:34](app/admin/evidence/page.tsx#L34)) y la columna existe en la
   migración 001, pero la página de caso usa la etiqueta genérica de categoría como `alt`. La regla
   del MVP de 48h es explícita: *"Every public image needs alt text."* Incumplida.

---

## 3. Componentes duplicados y ausencia de sistema

**No existe `components/ui/`.** `components/` es una carpeta plana de 10 archivos. Todo lo que
debería ser un primitivo compartido está copiado a mano:

| Duplicación | Dónde | Veces |
| --- | --- | --- |
| Tile de taxonomía (`<Link className="card p-5">`) | `crops/page.tsx:17-21`, `countries/page.tsx:17-21`, `problems/page.tsx:17-21` | 3× idéntico |
| Shell de "casos por taxonomía" (eyebrow + h1 + grid) | `crops/[slug]`, `countries/[slug]`, y extraído **solo localmente** como `TaxonomyCases` en `problems/[slug]/page.tsx:31-43` | 3× |
| Componente `Metric` | `CaseCard.tsx:33-40` (`rounded bg-muted p-3`) vs `cases/[slug]/page.tsx:136-143` (`card p-4`) vs `Kpi` en `admin/page.tsx:45-51` | 3 variantes distintas del mismo concepto |
| Helper `Select` | `SearchFilters.tsx:41-48` y `CaseForm.tsx:159-166`, carácter por carácter | 2× |
| Shell de tabla admin | `admin/cases`, `admin/import`, `admin/leads` | 3× |
| Banner de advertencia | `CaseForm.tsx:25` (`border-warning/50`) vs `cases/[slug]:72` (`border-warning/40`) | 2×, con opacidades distintas |

La existencia de tres `Metric` diferentes es el síntoma más claro: **el dato numérico —que es el
producto— no tiene una representación canónica.**

---

## 4. Inconsistencias visuales y deuda de UX

### 4.1 Tokens y sistema de diseño

- `tailwind.config.ts` (31 líneas) extiende **solo** `colors` (13 variables CSS) y una `boxShadow`.
  **No hay `fontFamily`, ni `fontSize`, ni `spacing`, ni `borderRadius`, ni `screens`, ni plugins.**
- **No hay fuentes.** No existe `next/font` ni una sola regla `font-family` en todo el proyecto: el
  sitio se renderiza con la fuente por defecto del navegador. No hay fuente display, ni cifras
  tabulares para los datos numéricos (que son el corazón del producto).
- `app/globals.css` es una capa de componentes escrita a mano (`.card`, `.btn`, `.input`, `.section`)
  fuera de `@layer`, con `#111913` hardcodeado en `.btn-download` saltándose los tokens.
- El paleta actual es exactamente lo que el brief prohíbe: verde genérico agro (`#2f7d4d` en claro,
  `#55ff9a` neón en oscuro).
- La escala tipográfica no existe: `text-5xl md:text-7xl` en home, `text-5xl` sin escalón móvil en
  detalle de caso y diagnóstico, `text-4xl` en listados, `text-3xl` en admin. `font-black` aplicado
  a casi todos los títulos y a muchas etiquetas de cuerpo.
- Espaciado sin sistema: `gap-5`, `gap-4`, `gap-3`, `gap-8` en el mismo nivel visual; padding de
  tarjeta `p-3`/`p-4`/`p-5`/`p-6` sin criterio.

### 4.2 Mobile-first: no se cumple

- `text-5xl font-black` **sin escalón móvil** en `cases/[slug]/page.tsx:69` y `diagnostico/page.tsx:42`
  → un titular de 48px en una pantalla de 360px.
- Las grillas saltan de 1 columna directamente a 3 en `md`. No hay `sm:grid-cols-2` en ninguna parte.
- `.container` usa un *gutter* fijo de 32px en todos los breakpoints.
- `.section` tiene `padding: 64px 0` fijo, sin reducción en móvil.
- La navegación es una tira horizontal de 7 enlaces con scroll y scrollbar oculta
  ([components/SiteChrome.tsx:19](components/SiteChrome.tsx#L19)): en móvil los enlaces —incluido
  `/admin`— simplemente se salen de pantalla sin ninguna señal de que hay más.

### 4.3 Estados ausentes

- **No hay `loading.tsx`, `error.tsx` ni `not-found.tsx` en ninguna parte** de la app, aunque cada
  página hace `await` a la base de datos sin caché.
- **No hay estados vacíos.** `cases/page.tsx:45-47`, los tres `[slug]` de taxonomía, y el módulo de
  casos relacionados renderizan un `.map()` pelado: cero resultados = grid en blanco silencioso. El
  encabezado "Casos relacionados" se pinta incluso cuando no hay ninguno.

### 4.4 Dispersión de CTAs

- `fichas/[id]` ofrece tres acciones que hacen lo mismo (descargar el PDF), y una de ellas tiene
  `className="btn"` sin variante → botón sin estilo.
- `CaseCard` enlaza al mismo destino dos veces (título + botón de ancho completo).
- `admin/import` pinta hasta 4 CTAs por fila de tabla.

### 4.5 i18n: fugas concretas

El sistema (`messages/en.json` / `messages/es.json`, 270 claves cada uno, sin claves faltantes) es
sólido, pero hay fugas reales:

- [lib/actions.ts:388-403](lib/actions.ts#L388-L403) — el mensaje de WhatsApp está **hardcodeado en
  español** y se envía también a usuarios en inglés.
- [app/cases/[slug]/page.tsx:145-157](app/cases/[slug]/page.tsx#L145-L157) — mapa de razones de match
  hardcodeado en español dentro de la página.
- `publicContentText()` en [lib/evidence-labels.ts:41-72](lib/evidence-labels.ts#L41-L72) sanea texto
  público con ~30 reglas regex **solo en inglés**, pero se aplica también al contenido en español,
  que pasa sin filtrar. Sus fallbacks (`"Nano-Gro case report"`) son literales en inglés que se
  muestran a usuarios en español.
- `LanguageProvider` importa **los dos diccionarios completos al bundle del cliente**
  ([components/LanguageProvider.tsx:4-5](components/LanguageProvider.tsx#L4-L5)): se envía el doble
  de peso del necesario a un agricultor con conexión lenta.
- Placeholders y etiquetas sueltas en inglés en `CaseForm`, `admin/evidence`, `admin/taxonomy`,
  `admin/review`.

### 4.6 Rendimiento

- Una sola imagen en toda la app y es un `<img>` crudo con ESLint suprimido, sin `next/image`, sin
  `width`/`height` (CLS garantizado), sin `loading="lazy"`.
- `getCasesByTaxonomy` ([lib/data.ts:87-92](lib/data.ts#L87-L92)) trae **todos** los casos publicados
  y filtra en memoria. Igual el filtrado de `/cases`: solo `evidence_level` y `case_completeness_score`
  se filtran en la base; `q`, cultivo, país y problema se filtran en JavaScript.
- `data-theme="dark"` está fijo en `<html>` mientras el script del cliente puede ponerlo en `light`
  → riesgo de flash, tapado con `suppressHydrationWarning`.

---

## 5. Lo que funciona y no se debe romper

Inventario deliberado de lo que el rediseño **preserva intacto**:

- **`lib/actions.ts` completo** — `submitLead`, `saveCase`, `saveEvidence`, `importCases`,
  `createDraftCasesFromImport`, `saveTaxonomy`, `loginAdmin`/`logoutAdmin`. Son *server actions* con
  `FormData`; sus nombres de campo son un contrato con la base de datos y con el RLS de Supabase
  (`leads` solo acepta `INSERT` público con `consent = true`).
- **Las 5 migraciones existentes.** Cualquier cambio de esquema que necesite el rediseño (p. ej. una
  sesión de cálculo de ROI) irá en una migración **nueva**, `006_*`.
- **El modelo de scoring** (`lib/scoring.ts`, `lib/publication-quality.ts`, `lib/case-report.ts`) y la
  puerta de publicación `canPublishCase`.
- **El middleware de i18n** y el mapa de slugs localizados de `lib/i18n-shared.ts`.
- **El admin entero.**

Un detalle a corregir con cuidado, no a ignorar: `calculateEvidenceScore` otorga el bono de +10 por
"consentimiento completo" a un array **vacío** de evidencias (`[].every(...)` es `true`,
[lib/scoring.ts:31](lib/scoring.ts#L31)). Un caso sin ninguna evidencia recibe puntos por consentir.
Es un bug real que infla el score público, y el rediseño lo expone al hacer visible el checklist.

---

## 6. Plan de rediseño propuesto (para tu aprobación)

**Fase 1 — Sistema de diseño.** Tokens (paleta de 6 con propósito, escala tipográfica completa, ritmo
de espaciado), tres fuentes vía `next/font` (display, cuerpo, tabular para datos), y `components/ui/`
con: `Button`, `Card`, `Badge` (nivel A/B/C/D semántico), `MetricStat` (número + etiqueta + tamaño de
muestra), `ConfidenceScore` (0-100 con checklist expandible), `Chip`, `Skeleton`, `EmptyState`,
`Stepper`. Elemento firma: **la Ficha de Evidencia**, un panel con estética de documento de
laboratorio verificado (Cultivo / País / Problema / Resultado / ROI / Nivel / Confianza) reutilizado
en tarjetas, detalle, resultados de diagnóstico y comparador. Entregable: `docs/DESIGN_SYSTEM.md`.

**Fase 2 — Página por página**, en orden de impacto: Home (el buscador *es* el hero + franja de
métricas agregadas con tamaño de muestra) → Detalle de caso → Listado con facetas → Hubs →
Diagnóstico como stepper con valor inmediato → Calculador de ROI (nuevo) → Galería antes/después (nueva).

**Fase 3 — Conversión y confianza.** Una conversión primaria por página, WhatsApp flotante
contextual, microcopy en voz activa, estados vacíos que orientan.

**Fase 4 — Rendimiento, SEO, accesibilidad, i18n.** `next/image`, schema.org, metadata dinámica,
contraste AA, cierre de las fugas de i18n del punto 4.5.

**Fase 5 — QA y entrega.** Build + lint limpios, flujos críticos probados a 360/768/1280,
`docs/REDESIGN_CHANGELOG.md`, PR `redesign/v2` → `main` sin merge.

### Dos decisiones que necesito que confirmes antes de la Fase 1

1. **`/cases` vs `/case-studies`.** La spec dice `/case-studies`; el código vive en `/cases` y el MVP
   de 48h impone *"Once a case is published, do not change its slug"*. Mi recomendación: **mantener
   `/cases`** (y `/casos` en español) y añadir redirecciones 301 desde `/case-studies`, en lugar de
   romper URLs que ya podrían estar indexadas. Coste de cambiarlo después: alto.

2. **El destino de `/fichas`.** Está fuera de la spec y se alimenta de datos estáticos en
   `lib/real-source-data.ts`, no de Supabase. Mi recomendación: **conservarla** como está por ahora
   (sin regresiones), armonizarla visualmente con el sistema nuevo, y no expandirla — su contenido
   pertenece conceptualmente a `/research` de la spec.
