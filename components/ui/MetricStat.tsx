import type { Messages } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n-shared";

export type MetricTone = "default" | "data" | "leaf";

const toneClass: Record<MetricTone, string> = {
  default: "text-foreground",
  data: "text-data",
  leaf: "text-primary"
};

/**
 * La representacion canonica de un numero en la plataforma.
 *
 * Regla de la spec ("Aggregate Results Index"): toda metrica agregada muestra su
 * tamano de muestra. Por eso `sampleSize` no es decoracion opcional: si el numero
 * resume varios casos, hay que pasarlo, y el componente lo imprime como "n = 12".
 * Cuando no hay dato, se dice que no hay dato; no se imprime un cero enganoso.
 */
export function MetricStat({
  label,
  value,
  sampleSize,
  footnote,
  tone = "default",
  size = "md",
  messages
}: {
  label: string;
  value: string | null;
  sampleSize?: number;
  footnote?: string;
  tone?: MetricTone;
  size?: "sm" | "md" | "lg";
  messages: Messages;
}) {
  const hasValue = value !== null && value !== undefined && value !== "";
  const valueSize = size === "lg" ? "text-metric-lg" : size === "sm" ? "text-h4" : "text-metric";

  return (
    <div className="min-w-0">
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={[
          "tabular mt-1 truncate",
          valueSize,
          hasValue ? toneClass[tone] : "text-h4 font-normal text-muted-foreground"
        ].join(" ")}
      >
        {hasValue ? value : messages.metrics.noData}
      </p>
      {typeof sampleSize === "number" ? (
        <p className="tabular mt-1 text-caption text-muted-foreground">
          {formatMessage(messages.metrics.sample, { count: sampleSize })}
        </p>
      ) : null}
      {footnote ? <p className="mt-1 text-caption text-muted-foreground">{footnote}</p> : null}
    </div>
  );
}
