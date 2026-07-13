# Changelog del rediseño — `redesign/v2`

Rama: `redesign/v2` · Base: `main` · 67 archivos, +6.017 / −598 líneas.

Estado de calidad al cierre: `npm run build`, `npm run typecheck` y `npm run lint` pasan limpios.
Las 17 rutas públicas responden 200 y los flujos críticos se verificaron ejecutando la aplicación,
no solo compilándola.

---

## Resumen por fase

### Fase 0 — Auditoría ([docs/AUDIT_REDESIGN.md](AUDIT_REDESIGN.md))

Inventario de las rutas existentes contra el sitemap de la spec. El hallazgo que ordenó todo el
trabajo posterior: la plataforma implementaba bien la mitad **ingesta** (admin, importación CSV,
evidencia, scoring, RLS) y había dejado sin construir casi toda la mitad **inteligencia**. Faltaban
por completo el calculador de ROI, la galería antes/después, el comparador y el índice de métricas
agregadas — justo el paso "Ver rango de ROI" del embudo que la propia spec declara como el más
valioso.

### Fase 1 — Sistema de diseño ([docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md))

Tokens con propósito, escala tipográfica completa, tres fuentes vía `next/font` y diez componentes
en `components/ui/`, incluida la **Ficha de Evidencia**, el elemento firma.

### Fases 2–4 — Páginas, conversión, rendimiento/SEO/a11y/i18n

Detalladas abajo.

### Fase 5 — QA y entrega

Este documento y el Pull Request.

---

## Decisiones de diseño y por qué

### 1. El color separa lo medido de lo vendido

La regla que sostiene el sistema visual: **`--data` (azul de laboratorio) es para lo que el campo
midió; `--primary` (verde hoja) es para lo que Nano-Gro propone.** Nunca al revés. Un número en
verde estaría mintiendo sobre qué es una medición y qué es una propuesta comercial. Es la diferencia
entre un sistema de evidencia y un folleto, expresada en color.

### 2. El buscador es el hero

La spec pide "problem-first search". Lo primero que ve un agricultor ya no es una promesa de marca,
es el campo donde escribe su cultivo. Es un `<form>` GET nativo: funciona sin JavaScript, deja una
URL compartible e indexable, y carga rápido en un teléfono de gama media.

### 3. Toda cifra agregada lleva su tamaño de muestra

Los guardrails del "Aggregate Results Index" no son sugerencias. `lib/aggregate.ts` está construido
de forma que **es imposible devolver un número sin su `sample`**: el tipo `Aggregate` es
`{ value, sample }`. Cuando no hay muestra, devuelve `null` y la interfaz dice "Sin datos" en lugar
de imprimir un cero engañoso. La home separa además verificados de no verificados y explica qué
significa "verificado".

### 4. El diagnóstico devuelve valor antes de vender

**Este era el incumplimiento más grave.** `submitLead` hacía `redirect()` a `wa.me/...`: el usuario
enviaba sus datos y salía del sitio sin recibir absolutamente nada, cuando la spec exige que reciba
*casos similares, categoría probable del problema y recomendación preliminar*.

Ahora el lead se guarda exactamente igual que antes (mismos campos, mismo `consent: true` que exige
el RLS) y el usuario aterriza en `/diagnostico/resultado`, donde ve su diagnóstico preliminar
derivado de los casos que hicieron match. WhatsApp sigue a un toque, pero **después** de haber
recibido algo, no en lugar de ello.

El formulario pasó de una pantalla a un stepper de 8 pasos con barra de progreso, y ahora normaliza
cultivo/país/problema contra la taxonomía en vez de aceptar texto libre (antes el formulario recibía
las listas como props y no las usaba, así que los leads entraban sin normalizar).

### 5. La calculadora se niega a inventar

El rango de mejora no lo elige un comercial: sale de los casos documentados del cultivo elegido. Si
no hay casos comparables, la calculadora **no calcula** y lo dice. Preferimos no dar un número antes
que dar uno inventado. El cálculo completo viaja adjunto al lead para que el equipo técnico no
empiece de cero.

### 6. Una sola conversión primaria por página

El detalle de caso tenía un formulario de lead compitiendo con otros CTAs. Ahora tiene **una** acción
permanente — el diagnóstico gratuito, contextualizado con el cultivo y el país de ese caso concreto —
fija abajo en móvil y en el raíl derecho en escritorio. WhatsApp es el canal alternativo, no un CTA
rival, y su mensaje va pre-rellenado con el caso que el usuario está viendo.

### 7. Las razones del match son claves, no strings

`lib/related.ts` devolvía razones en inglés y la página las traducía con un mapa de strings
incrustado: si alguien cambiaba `"Same crop"`, la traducción se rompía en silencio. Ahora la clave es
el contrato y el texto vive en `messages/*.json`.

### 8. Los hubs son mini-sitios, no listados finos

Cultivos, países y problemas eran el **mismo listado copiado tres veces**. Ahora son un único
componente (`TaxonomyHub`) con estadísticas propias, mejores casos verificados, evidencia visual,
enlaces cruzados y consulta contextual. Los enlaces cruzados alimentan las rutas programáticas de
dos niveles (`/crops/[crop]/[problem]`, `/countries/[country]/[crop]`), que son el patrón de
enlazado interno de la sección 14.

---

## Cambios que tocan datos o comportamiento (léelos antes de aprobar)

1. **`submitLead` ya no redirige a WhatsApp.** El `INSERT` en `leads` es idéntico; lo que cambia es
   el destino del `redirect()`. Los campos `email`, `current_production`, `objective` y los `*_slug`
   son **aditivos**: el código antiguo que no los enviaba resolvía a `""` y sigue funcionando.

2. **Bug de scoring corregido.** `calculateEvidenceScore` daba el bono de +10 por "consentimiento
   completo" a un array **vacío** de evidencias (`[].every(...)` es `true` en JavaScript). Un caso sin
   una sola foto puntuaba por tener el consentimiento en regla. Los `evidence_score` ya guardados para
   casos sin evidencia están **inflados en 10 puntos** y se recalculan solos la próxima vez que se
   guarde cada caso desde el admin. Ver "Deuda pendiente".

3. **Tema claro por defecto.** El sitio arrancaba en oscuro. Un agricultor consultando el móvil a
   pleno sol lee mejor sobre papel claro. El toggle sigue ahí y respeta `prefers-color-scheme`.

4. **`/admin` sale de la navegación pública.** Un agricultor no tiene nada que hacer ahí. El acceso
   sigue existiendo por URL directa y sigue protegido por el middleware.

5. **`alt_text` ahora se renderiza.** La base lo guardaba desde la migración 001 y el admin lo pedía,
   pero la app nunca lo usaba: ponía la etiqueta genérica de categoría. Ahora se usa el texto real.

6. **Redirects 301 desde `/case-studies`** hacia `/cases`, según lo acordado: cumple la spec sin
   romper URLs que ya podrían estar indexadas.

7. **Eliminados `CaseCard`, `SearchFilters` y `LeadForm`** — sin uso tras el rediseño.

**No se tocó:** las cinco migraciones existentes, el admin, el modelo de scoring (salvo el bug), la
puerta de publicación `canPublishCase`, ni el middleware de i18n.

---

## QA ejecutado

Todo esto se comprobó **ejecutando la aplicación** (`npm start`), no solo compilándola:

| Comprobación | Resultado |
| --- | --- |
| 17 rutas públicas (es/en) | 200 |
| Redirect `/case-studies` → `/cases` | 308 permanente |
| Home: métricas agregadas con `n =`, split verificados, disclaimer | OK |
| Detalle: score de confianza, checklist, casos similares con razón, CTA | OK |
| Detalle: JSON-LD `Article` + `BreadcrumbList` | OK |
| Diagnóstico: stepper "Paso 1 de 8", `role="progressbar"` | OK |
| Diagnóstico: los 13 campos que espera `submitLead` presentes en el DOM | OK |
| Resultado: categoría probable, recomendación, casos similares, WhatsApp | OK |
| Listado: facetas con contadores, orden, comparar, estado vacío con salida | OK |
| Galería: 8 imágenes, **0 sin `alt`** | OK |
| Calculadora: disclaimers presentes, ruta "sin casos comparables" | OK |
| Sitemap: 232 URLs, 21 combos cultivo+problema, 22 país+cultivo, `hreflang` | OK |

Responsive verificado por construcción (mobile-first a 360px, escalones `sm`/`lg`); el `min-height`
de 44px en controles se confirmó en el CSS servido.

---

## Deuda pendiente y próximos pasos recomendados

Por orden de importancia:

1. **Lighthouse móvil ≥ 90: no verificado.** No pude ejecutar Lighthouse en este entorno, así que
   **no afirmo que se cumpla el criterio de aceptación.** La base es buena (componentes de servidor
   por defecto, `next/image` con `sizes`, fuentes con `next/font`, JS de cliente solo en el wizard, la
   calculadora, el comparador y el slider), pero hay que medirlo antes de dar por bueno el número.

2. **Script de recálculo masivo de `evidence_score`.** Los casos sin evidencia guardados antes del fix
   tienen 10 puntos de más hasta que alguien los reguarde. Es una migración de datos, no de esquema.

3. **`lib/localized-content.ts` traduce por ID de caso hardcodeado.** Los casos reales de Supabase con
   otros IDs no reciben traducción. El sistema de i18n de la *interfaz* está completo, pero el del
   *contenido* no escala: hay que llevar las traducciones a columnas de la base.

4. **Filtrado en memoria.** `getPublishedCases()` trae todos los casos publicados y filtra en
   JavaScript. Con 50-100 casos es irrelevante; a partir de unos cientos hay que empujar los filtros a
   Postgres (o a Meilisearch, como sugiere la spec).

5. **Migración `006_roi_sessions.sql` no creada.** Aprobaste crearla, pero la calculadora acabó
   adjuntando su contexto al lead en `comments`, que cubre el requisito de la spec ("lead form with the
   calculator context attached") sin tocar el esquema. Si quieres analítica sobre los cálculos
   (cuántos se hacen, con qué cultivos, cuántos convierten), entonces sí hace falta la tabla.

6. **`publicContentText()` sanea solo en inglés.** Sus ~30 reglas regex no filtran el texto en
   español, que pasa sin lavar. Y sus fallbacks eran literales en inglés (ya corregidos en las páginas
   nuevas, pero la función sigue siendo asimétrica).

7. **Sin control group.** La spec contempla `has_control_group` en el score de confianza; la base no
   tiene la columna. El checklist lo omite en lugar de inventarlo. Añadirlo subiría la credibilidad
   científica de los casos de nivel A.

8. **Rutas de la spec aún sin construir:** `/results/*`, `/knowledge`, `/research`, `/videos`,
   `/product`, `/become-distributor`, `/contact`. Ninguna bloquea el embudo de conversión; la home ya
   tiene el bloque de distribuidor apuntando a WhatsApp.
