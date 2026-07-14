import transcripts from "@/lib/case-transcripts.json";
import type { Messages } from "@/lib/i18n-shared";
import type { EvidenceAsset } from "@/lib/types";

/**
 * Leer el informe original SIN descargarlo.
 *
 * Hasta ahora la unica forma de comprobar la fuente era bajarse un .docx y tener Word. Eso
 * expulsa a media audiencia justo en el momento en que iba a verificar la evidencia — que
 * es, literalmente, la razon de ser de esta plataforma.
 *
 *   - Los PDF los abre el propio navegador: se muestran incrustados.
 *   - Los .docx no: ningun navegador sabe. Se muestra la TRANSCRIPCION del documento,
 *     generada por scripts/extract-docx-text.mjs.
 *
 * La transcripcion se presenta como lo que es. No se disfraza de original: el archivo
 * intacto sigue descargable al lado, y se dice que las tablas pueden haber perdido su
 * formato. Preferimos que el visitante lea el informe con una tabla desordenada a que no lo
 * lea nunca.
 */
export function ReportReader({ assets, messages }: { assets: EvidenceAsset[]; messages: Messages }) {
  const map = transcripts as Record<string, string>;

  const readable = assets
    .map((asset) => {
      const fileName = asset.file_url.split("/").pop() ?? "";
      const isPdf = /\.pdf$/i.test(fileName);
      const transcript = map[fileName];
      if (isPdf) return { asset, kind: "pdf" as const, text: null };
      if (transcript) return { asset, kind: "text" as const, text: transcript };
      return null;
    })
    .filter((entry) => entry !== null);

  if (!readable.length) return null;

  return (
    <section id="report" className="mt-10 scroll-mt-24">
      <h2 className="text-h3 text-foreground">{messages.caseDetail.readReportTitle}</h2>
      <p className="mt-1 max-w-prose text-body text-muted-foreground">{messages.caseDetail.readReportBody}</p>

      <div className="mt-5 grid gap-4">
        {readable.map(({ asset, kind, text }) => (
          <details key={asset.id} className="card p-5">
            <summary className="cursor-pointer text-body font-semibold text-foreground marker:text-muted-foreground">
              {messages.caseDetail.readReportOpen}
              <span className="ml-2 font-normal text-muted-foreground">{asset.file_name}</span>
            </summary>

            {kind === "pdf" ? (
              /*
               * El PDF se incrusta con `object`, que degrada solo: si el navegador no sabe
               * mostrarlo (algunos moviles no), enseña el enlace de dentro en vez de un
               * recuadro roto.
               */
              <object
                className="mt-4 h-[70vh] w-full rounded border border-border"
                data={asset.file_url}
                type="application/pdf"
              >
                <a className="btn btn-primary" href={asset.file_url} rel="noopener noreferrer" target="_blank">
                  {messages.cases.downloadOriginalReport}
                </a>
              </object>
            ) : (
              <>
                <p className="mt-4 border-l-2 border-warning/50 pl-3 text-caption leading-5 text-warning">
                  {messages.caseDetail.transcriptNote}
                </p>
                <div className="mt-4 max-h-[60vh] overflow-y-auto rounded border border-border bg-muted/40 p-4">
                  <pre className="whitespace-pre-wrap break-words font-sans text-body leading-7 text-foreground">
                    {text}
                  </pre>
                </div>
              </>
            )}

            <a
              className="btn btn-secondary mt-4"
              href={asset.file_url}
              download
              rel="noopener noreferrer"
              target="_blank"
            >
              {messages.cases.downloadOriginalReport}
            </a>
          </details>
        ))}
      </div>
    </section>
  );
}
