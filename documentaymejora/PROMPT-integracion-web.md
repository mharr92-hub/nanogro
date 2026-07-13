# Prompt para Claude Code — Integrar documentación técnica + gerente técnico en nanogro.lat

> Pega esto como un solo mensaje en Claude Code, dentro del repo `nanogro`. Está escrito para respetar la arquitectura actual (Next.js App Router, i18n es/en, server components por defecto, contenido en Supabase, regla de color azul-laboratorio / verde-hoja, taxonomía de cultivo/país/problema, y disciplina de "evidencia documentada, no garantías").

---

## Contexto y regla de oro

Voy a añadir dos bloques de contenido nuevos y permanentes al sitio: (1) una sección de **producto y evidencia técnica** de Nano-Gro y Minerales Tierra Fértil, y (2) el perfil del **gerente técnico**. Todo el material nuevo debe convivir con la filosofía existente del sitio:

- Nada se presenta como resultado garantizado. Los beneficios del producto se etiquetan como **"afirmaciones del fabricante"** o **"resultado observado en el caso X"**, nunca como "lo que obtendrás".
- Mantener la regla de color: **azul = dato medido; verde = propuesta/producto Nano-Gro. Nunca al revés.**
- Todo bilingüe (es/en) con hreflang, como el resto del sitio.
- Server components por defecto; JS de cliente solo si un componente es interactivo.
- No inventar cifras: usar solo las de este prompt. Donde una cifra tenga muestra o contexto, mostrarlo.

---

## Tarea 1 — Página "Tecnología / Producto" (`/es/tecnologia`, `/en/technology`)

Crear una ruta nueva, enlazada en el nav principal (después de "Fichas técnicas"). Estructura:

**a) Qué es Nano-Gro.** Bioestimulante 100% orgánico, regulador del crecimiento y potenciador de la inmunidad. No es fertilizante, fungicida ni pesticida. Nano-sulfatos minerales en concentración 10⁻⁹ que reactivan las vías de comunicación electroquímica de la planta. Fabricante NG Caribbean.

**b) Los tres mecanismos** (tarjetas): absorción radicular · absorción foliar · sistema inmunológico.

**c) Efectos (afirmaciones del fabricante, en verde).** Aumenta fotosíntesis; acelera metabolismo celular; sube grados Brix; acelera crecimiento y engrosamiento celular; fortalece inmunidad; aumenta resistencia a sequía, inundación y helada; maximiza absorción de nutrientes; cosechas más uniformes y maduración pareja; mejor resistencia en anaquel; raíz más fuerte y profunda; evita el acame (arroz, caña, plátano, maíz).

**d) Resultados de campo documentados (en azul, cada uno con su cultivo/lugar).** Enlazar cada fila, cuando exista, al caso correspondiente en Supabase:
- Frijol en laderas (El Salvador): 21 → 45 qq/mz.
- Maíz (San Sebastián, El Salvador, 2015): resistió 28 días de sequía, +35% producción vs no tratado.
- Caña de azúcar (El Salvador, 2015): +37.9% en número de tallos, +22% grosor de tallo, +0.8 Brix; parcela vs testigo 40/29 cañas por metro lineal.
- Banano/musáceas: +15-20% peso del dedo ≈ +1.200 USD/ha/año.
- Germinación: hasta 15 días de adelanto (frijol).
- Guayaba con nematodos (>90% infestación): rebrote a ~33 días.

**e) Validaciones institucionales** (logos/lista): INIFAT (Cuba), Universidad del Valle (Guatemala), SAGARPA e INIFAP (México), CENTA (El Salvador). Nota clave: resultados superiores con tratamiento a semilla + solo 50% de la fertilización. Añadir la referencia académica externa del estudio revisado por pares de NANO-GRO® en tomate (Polonia) como "validación independiente".

**f) Certificaciones (barra de sellos):** OMRI (EE.UU.), OACC (Canadá), ISO 9001:2000, BPM, No peligroso OSHA, No fitotóxico, Sin efecto residual. Cada sello con tooltip de una línea.

**g) Ficha de datos rápidos:** dosis 8-10 cápsulas/ha en 200 L; vida útil 15 años; pH óptimo 3.5-8; compatible con fertilizantes/insecticidas/fungicidas (no herbicidas); aplicable en gramíneas, leguminosas, cucurbitáceas y frutales. Botón "Descargar ficha técnica completa (PDF)" hacia el PDF ya alojado en `/source-data/fichas/`.

**h) Bloque Minerales Tierra Fértil Plus.** Acondicionador de suelos 100% natural; análisis AOAC (SiO₂ 50.84%, Fe 1.70%, N 489, P 900, K 335 mg/kg, MO 1.73%, pH 8.08). Narrativa de sistema: *Tierra Fértil repone los minerales del suelo; Nano-Gro reactiva la comunicación de la planta para aprovecharlos.*

Cerrar la página con los CTA existentes: "Diagnóstico gratuito" y WhatsApp.

---

## Tarea 2 — Sección "Gerente técnico" (parte integral del sitio)

Crear un componente reutilizable de perfil del líder técnico y colocarlo como bloque en (a) una página propia `/es/equipo` · `/en/team` enlazada en el footer, y (b) un bloque compacto ("Respaldo técnico") en la home y en cada página de caso, junto al score de confianza — para que el rigor tenga cara y firma.

Contenido confirmado por la documentación: **Ing. Pedro Pablo Rivero Hayes**, autor del dossier técnico de nanotecnología aplicada a la agricultura y contacto técnico de Nano-Gro.

Dejar los campos de credenciales como datos estructurados en un solo archivo de contenido (p. ej. `content/team.ts`) para que se editen sin tocar el markup:

```ts
export const leadTechnician = {
  name: "Pedro Pablo Rivero Hayes",   // ⚠️ CONFIRMAR: ¿Rivero Hayes o Rivera?
  role: "Gerente Técnico",
  photo: "/source-data/team/pedro.jpg", // ⚠️ FALTA foto
  yearsExperience: null,                // ⚠️ FALTA: décadas exactas
  degrees: [],                          // ⚠️ FALTA: título(s) + universidad
  certifications: [],                   // ⚠️ FALTA
  countries: ["El Salvador","México","Guatemala","Cuba"], // ajustar
  bio: "",                              // ⚠️ FALTA: 2-3 frases
  authored: "Dossier técnico: Producto Orgánico de Nanotecnología Aplicado a la Agricultura (54 pág.)",
};
```

Si un campo está vacío, el componente lo oculta (no muestra "null"). Renderizar bilingüe. NO inventar ninguna credencial: los campos marcados ⚠️ los rellena Mark.

---

## Fuera de alcance / no tocar
No cambiar el motor de score de confianza, la calculadora de ROI ni la taxonomía. No publicar como "verificado" nada que no lo esté. No exponer el detalle de trazas de metales de la ficha en el contenido de marketing (el PDF completo ya está disponible para quien lo descargue).

## Al terminar
Correr build, typecheck y lint. Añadir las rutas nuevas al sitemap con hreflang. Reportar qué campos de `team.ts` quedaron pendientes de datos reales.
