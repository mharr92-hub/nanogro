import type { ConfidenceResult } from "@/lib/confidence";

export function ConfidenceMeter({ score }: { score: number }) {
  const tone =
    score >= 75 ? "bg-brand" : score >= 50 ? "bg-amber-500" : "bg-gray-400";
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full ${tone}`} style={{ width: `${score}%` }} />
      </div>
      <span className="shrink-0 text-sm font-bold">{score}/100</span>
    </div>
  );
}

export function ConfidenceBreakdown({ result, title }: { result: ConfidenceResult; title: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ConfidenceMeter score={result.score} />
      <ul className="mt-3 space-y-1.5 text-sm">
        {result.components.map((c) => (
          <li key={c.key} className="flex justify-between text-muted">
            <span>{c.label}</span>
            <span className="font-medium text-foreground">
              {c.earned}/{c.max}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
