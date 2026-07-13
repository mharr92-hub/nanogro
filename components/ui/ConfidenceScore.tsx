import { countDocumented, getEvidenceChecklist } from "@/lib/evidence-checklist";
import type { Messages } from "@/lib/i18n-shared";
import { formatMessage } from "@/lib/i18n-shared";
import type { CaseStudy } from "@/lib/types";

/**
 * Score de confianza 0-100 con el checklist de evidencia que lo explica.
 *
 * El checklist se despliega con <details>, sin JavaScript: funciona en el primer
 * render del servidor y en un telefono de gama media con conexion lenta.
 */
export function ConfidenceScore({
  item,
  messages,
  defaultOpen = false
}: {
  item: CaseStudy;
  messages: Messages;
  defaultOpen?: boolean;
}) {
  const score = item.confidence_score ?? 0;
  const checklist = getEvidenceChecklist(item);
  const documented = countDocumented(checklist);

  return (
    <section className="card p-5" aria-labelledby="confidence-heading">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="confidence-heading" className="text-h4 text-foreground">
          {messages.confidence.title}
        </h2>
        <p className="tabular text-metric text-data">
          {score}
          <span className="text-h5 text-muted-foreground">/100</span>
        </p>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-muted"
        role="img"
        aria-label={formatMessage(messages.confidence.of100, { score })}
      >
        <div className="h-full rounded-pill bg-data" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>

      <details className="mt-4" open={defaultOpen}>
        <summary className="cursor-pointer text-body font-semibold text-foreground marker:text-muted-foreground">
          {messages.confidence.why}{" "}
          <span className="tabular text-muted-foreground">
            ({formatMessage(messages.confidence.documentedOf, { documented, total: checklist.length })})
          </span>
        </summary>
        <ul className="mt-3 grid gap-2">
          {checklist.map((entry) => (
            <li key={entry.key} className="flex items-start gap-2 text-body">
              <span
                aria-hidden="true"
                className={[
                  "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded text-caption font-bold",
                  entry.met ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                ].join(" ")}
              >
                {entry.met ? "✓" : "—"}
              </span>
              <span className={entry.met ? "text-foreground" : "text-muted-foreground"}>
                {messages.confidence.checklist[entry.key]}
                <span className="sr-only">
                  {" — "}
                  {entry.met ? messages.confidence.met : messages.confidence.missing}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-border pt-3 text-caption leading-5 text-muted-foreground">
          {messages.confidence.disclaimer}
        </p>
      </details>
    </section>
  );
}
