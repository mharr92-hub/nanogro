import type { Messages } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n-shared";

/**
 * Barra de progreso del diagnostico: una pregunta por paso.
 *
 * El agricultor debe saber siempre cuanto le falta. Un formulario largo sin
 * progreso visible se abandona; ocho preguntas cortas con barra, no.
 */
export function Stepper({
  current,
  total,
  label,
  messages
}: {
  current: number;
  total: number;
  label: string;
  messages: Messages;
}) {
  const percent = Math.round((current / total) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-label font-semibold uppercase tracking-wide text-muted-foreground">
          {formatMessage(messages.stepper.stepOf, { current, total })}
        </p>
        <p className="tabular text-caption text-muted-foreground">{percent}%</p>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-muted"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={formatMessage(messages.stepper.stepOf, { current, total })}
      >
        <div className="h-full rounded-pill bg-primary transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <h2 className="mt-4 text-h2 text-foreground">{label}</h2>
    </div>
  );
}
