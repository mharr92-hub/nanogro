import reportIndex from "@/lib/case-reports.json";
import type { Messages } from "@/lib/i18n-shared";
import type { EvidenceAsset } from "@/lib/types";

/**
 * Ver el INFORME ORIGINAL sin descargar nada.
 *
 * Es la pieza que cambia la perspectiva de quien mira. Leer un resumen escrito por la
 * empresa que vende el producto no convence a nadie; ver el documento de campo, con su
 * membrete, sus tablas de mediciones y sus fotos, es otra cosa completamente distinta. Por
 * eso este bloque es la accion destacada de la pagina y la descarga pasa a segundo plano:
 * quien quiera el archivo lo tiene, pero ya no es el unico camino.
 *
 *   - .docx  ->  se muestra el documento reconstruido (scripts/convert-docx-to-html.mjs),
 *                con sus tablas y sus fotos, dentro de un iframe aislado.
 *   - .pdf   ->  lo pinta el propio navegador.
 *   - .jpeg  ->  las paginas escaneadas se muestran como imagenes.
 *
 * El iframe va en `sandbox` sin permisos: el documento se ve, pero no puede ejecutar nada
 * ni tocar la pagina que lo contiene.
 */

type Viewable = {
  asset: EvidenceAsset;
  kind: "document" | "pdf" | "image";
  src: string;
};

export function ReportReader({ assets, messages }: { assets: EvidenceAsset[]; messages: Messages }) {
  const index = reportIndex as Record<string, string>;

  const viewable: Viewable[] = assets
    .map((asset): Viewable | null => {
      const fileName = asset.file_url.split("/").pop() ?? "";

      const rebuilt = index[fileName];
      if (rebuilt) return { asset, kind: "document", src: rebuilt };
      if (/\.pdf$/i.test(fileName)) return { asset, kind: "pdf", src: asset.file_url };
      if (/\.(jpe?g|png)$/i.test(fileName)) return { asset, kind: "image", src: asset.file_url };
      return null;
    })
    .filter((entry): entry is Viewable => entry !== null);

  // Los formatos que ningun navegador sabe abrir (.doc antiguo, .rar) solo se descargan.
  const downloadOnly = assets.filter(
    (asset) => !viewable.some((entry) => entry.asset.id === asset.id)
  );

  if (!viewable.length && !downloadOnly.length) return null;

  return (
    <section id="report" className="mt-10 scroll-mt-24">
      <h2 className="text-h3 text-foreground">{messages.caseDetail.readReportTitle}</h2>
      <p className="mt-1 max-w-prose text-body text-muted-foreground">{messages.caseDetail.readReportBody}</p>

      <div className="mt-5 grid gap-6">
        {viewable.map(({ asset, kind, src }) => (
          <figure key={asset.id} className="card overflow-hidden p-0">
            <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <span className="min-w-0 break-words text-body font-semibold text-foreground">{asset.file_name}</span>
              {/* La descarga baja de perfil: es un enlace, no un boton. */}
              <a
                className="flex-none text-caption font-semibold text-muted-foreground underline hover:text-foreground"
                href={asset.file_url}
                download
                rel="noopener noreferrer"
                target="_blank"
              >
                {messages.cases.downloadOriginalReport} ↓
              </a>
            </figcaption>

            {kind === "image" ? (
              // Las paginas escaneadas: se ven, sin mas.
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={asset.alt_text ?? asset.file_name ?? ""} className="w-full" src={src} loading="lazy" />
            ) : (
              <iframe
                className="h-[75vh] w-full bg-white"
                src={src}
                title={asset.file_name ?? messages.caseDetail.readReportTitle}
                loading="lazy"
                sandbox=""
              />
            )}

            {kind === "document" ? (
              <p className="border-t border-border p-3 text-caption leading-5 text-muted-foreground">
                {messages.caseDetail.transcriptNote}
              </p>
            ) : null}
          </figure>
        ))}

        {downloadOnly.length ? (
          <ul className="grid gap-2">
            {downloadOnly.map((asset) => (
              <li key={asset.id}>
                <a
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded border border-border px-4 hover:bg-muted"
                  href={asset.file_url}
                  download
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="min-w-0 break-words text-body text-foreground">{asset.file_name}</span>
                  <span className="flex-none text-caption font-semibold text-muted-foreground">
                    {messages.cases.downloadOriginalReport} ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
