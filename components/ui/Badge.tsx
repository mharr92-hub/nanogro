import type { ReactNode } from "react";
import type { Messages } from "@/lib/i18n-shared";
import type { EvidenceLevel } from "@/lib/types";

export type BadgeTone = "neutral" | "leaf" | "data" | "warning" | "danger";

const toneClass: Record<BadgeTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  leaf: "border-primary/30 bg-accent text-accent-foreground",
  data: "border-data/30 bg-data-tint text-data",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger"
};

export function Badge({
  tone = "neutral",
  className = "",
  children
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-caption font-semibold",
        toneClass[tone],
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

const levelTone: Record<EvidenceLevel, BadgeTone> = {
  A: "leaf",
  B: "data",
  C: "warning",
  D: "neutral"
};

/**
 * Nivel de evidencia A/B/C/D. El nivel nunca aparece desnudo: siempre lleva su
 * descripcion accesible, porque una letra sin explicacion no genera confianza.
 */
export function EvidenceLevelBadge({
  level,
  messages,
  showName = false
}: {
  level: EvidenceLevel;
  messages: Messages;
  showName?: boolean;
}) {
  const copy = messages.evidenceLevels[levelKey(level)];
  return (
    <Badge tone={levelTone[level]} className="uppercase">
      <abbr className="no-underline" title={copy.description} aria-label={`${copy.name}. ${copy.description}`}>
        <span className="tabular">{messages.evidenceLevels.short.replace("{level}", level)}</span>
        {showName ? <span className="ml-1 normal-case font-normal">{copy.name}</span> : null}
      </abbr>
    </Badge>
  );
}

function levelKey(level: EvidenceLevel) {
  return level.toLowerCase() as "a" | "b" | "c" | "d";
}
