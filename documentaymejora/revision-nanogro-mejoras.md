# Revisión de nanogro.lat — mejoras priorizadas
**Fecha:** 13 julio 2026 · Revisado en producción (www.nanogro.lat)

## P0 — Corregir hoy (bloquean conversión o SEO)

**1. WhatsApp está desactivado en todo el sitio.** Las variables `NEXT_PUBLIC_WHATSAPP_NUMBER` y `NANO_GRO_WHATSAPP_NUMBER` están vacías en Vercel, y la app oculta los botones de WhatsApp a propósito cuando faltan (para no publicar `wa.me` sin destinatario). Resultado: hoy ningún visitante puede escribiros. El número comercial aparece en vuestra propia ficha de Panamá: +507 6550 6127. Fix: Vercel → Settings → Environment Variables → añadir en Production:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=50765506127
NANO_GRO_WHATSAPP_NUMBER=50765506127
```
y redeploy.

**2. `NEXT_PUBLIC_SITE_URL` sigue en `http://localhost:3000`.** Prueba visible: https://www.nanogro.lat/robots.txt publica `Sitemap: http://localhost:3000/sitemap.xml`. Las URLs del sitemap y el hreflang probablemente también apuntan a localhost. Google no puede indexar bien el sitio así. Fix: misma pantalla de Vercel, `NEXT_PUBLIC_SITE_URL=https://www.nanogro.lat`, redeploy, y después verificar robots.txt y enviar el sitemap en Search Console.

**3. `ADMIN_PASSWORD`.** El ejemplo trae "change-this-before-production". Confirmar que en Vercel hay una contraseña fuerte y distinta.

**4. Casos eliminados devuelven página vacía, no 404.** Ejemplo: la URL del antiguo caso de cacao (NG-001) renderiza header y footer sin contenido, con `noindex`. Debe devolver 404 real (`notFound()`), y idealmente redirigir a /casos.

## P1 — Confianza (el sitio vende evidencia; esto la contradice)

**5. "Evidencia verificada" con 0 verificados.** El rótulo de la sección de casos destacados dice "Evidencia verificada" mientras las estadísticas de la misma página dicen "0 verificados y 26 sin verificar". O cambiar el rótulo (el subtítulo "Casos con la evidencia más completa" es honesto y suficiente) o —mejor— conseguir que un agrónomo verifique 2-3 casos ya: pasaríais de 0 a algo defendible.

**6. La galería "Antes y después" es una sola foto repetida 7 veces**, y es del caso con confianza 30/100. Los informes PDF/DOCX ya subidos (México, Cuba, ENA…) contienen fotos reales: extraerlas, asociarlas a sus casos con alt en español, y mientras tanto mostrar solo las fotos únicas que existan.

**7. Los textos de casos no llevan tildes.** "Recuperacion", "tecnologia", "alcanzo", "sequia", "anecdotico", "biometrica"… El código de la interfaz sí está bien; es el contenido en Supabase. Pasada de ortografía a títulos, resúmenes y descripciones de nivel.

**8. Mezcla de idiomas.** Dosis en inglés en páginas ES ("8 Nano-Gro tablets in the evaluated package"); alt de fotos en inglés ("Field photographic record"); etiquetas en español dentro de /en ("Rendimiento medio", "Supervivencia al trasplante"); el slug /en/fichas sin traducir.

**9. Lenguaje interno visible al público.** "Adjunto, pendiente de extraer", "Revisión técnica pendiente" — reformular ("Documento original disponible").

**10. Pluralización:** "2 documento técnico recibido".

**11. Tarjetas con la métrica duplicada** (maíz ALBA, banano Guatemala, chile: la misma fila aparece dos veces).

**12. El bloque "Diagnóstico gratuito" se renderiza dos veces seguidas** al final de cada página de caso, más un tercer enlace suelto.

**13. "TRM de 0.54" sin explicación** en el caso de frijol. Si es retorno <1, explicar qué mide y en qué contexto, o no destacarlo junto al +35.1%.

## P2 — Diseño y conversión

**14. Hero sin H1 ni propuesta de valor.** La página abre con un disclaimer legal. Propuesta: H1 tipo "Evidencia real de campo para decidir sobre tu cultivo", subtítulo honesto, CTA primario "Diagnóstico gratuito — 8 preguntas" (hoy está al fondo de la página siendo vuestro mejor activo de conversión) y secundario "Ver los 26 casos". El disclaimer, debajo, en pequeño.

**15. El buscador de "Palabra clave" es el primer elemento interactivo.** El agricultor no busca por palabra clave; entra por problema (ese grid ya lo tenéis y es bueno). Mover búsqueda al header o a /casos.

**16. Emojis como iconografía.** 📉💧🦠 + 🥔 para papaya (es una patata), 🎋 para caña, 🍐 para guayaba, banderas emoji. Se renderizan distinto en cada dispositivo y restan seriedad técnica. Sustituir por un set consistente (p. ej. lucide) coloreado según vuestra regla: azul = medición, verde = propuesta Nano-Gro.

**17. Footer real.** Hoy: navegación repetida + disclaimer. Falta: WhatsApp y contacto, quiénes somos, y una política de privacidad — recogéis datos personales con consentimiento y no hay página legal que lo respalde.

**18. El wizard pregunta primero el país**, con lista que incluye China, Nigeria y Polonia (países de la evidencia, no de vuestros clientes). Empezar por cultivo o problema; país después con los mercados objetivo primero.

**19. Jerarquía de la tarjeta de caso.** Hoy compiten 6 datos al mismo peso. Propuesta: título → resultado grande → badge nivel+confianza → máximo 2 metadatos. El resto, dentro del caso.

**20. Breadcrumbs** existen en la calculadora pero no en casos. Unificar.

**21. Los 11 casos de nivel D diluyen el listado.** Filtro por defecto "nivel A-C" con opción de mostrar el archivo completo, o sección aparte "Archivo documental".

## Pendiente de medir
- **Lighthouse:** no pude ejecutarlo desde este entorno. Corre https://pagespeed.web.dev con `https://www.nanogro.lat/es` (móvil). Criterio de la spec: ≥ 90 en las cuatro categorías.
- **Sitemap:** tras el fix del punto 2, comprobar que las 232 URLs usan el dominio real y enviarlo en Google Search Console.

## Lo que ya está bien (no tocar)
Score de confianza desglosado (2 de 8 documentados, con lista), niveles A-D definidos en cada badge, `n =` junto a cada promedio, la calculadora que se niega a calcular sin casos comparables, CTAs contextuales por caso (diagnóstico prellenado con cultivo/país/problema), títulos por página correctos en las páginas clave.
