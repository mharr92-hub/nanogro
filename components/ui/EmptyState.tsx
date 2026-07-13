import type { ReactNode } from "react";

/**
 * Estado vacio que orienta, no que decora.
 *
 * Regla: nunca se muestra un vacio sin una salida. "No hay casos de este cultivo
 * en tu pais todavia" va siempre acompanado de a donde ir en su lugar.
 */
export function EmptyState({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-start gap-3 border-dashed p-6 sm:p-8">
      <h3 className="text-h4 text-foreground">{title}</h3>
      <p className="max-w-prose text-body text-muted-foreground">{body}</p>
      {action ? <div className="mt-1 flex flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
