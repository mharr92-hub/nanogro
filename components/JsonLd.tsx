export type JsonLdData = Record<string, unknown>;

/** Datos estructurados schema.org (spec, seccion 14). */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // El contenido lo construimos nosotros a partir de datos ya saneados, no del usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
