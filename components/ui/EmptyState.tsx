import type { ReactNode } from "react";

/**
 * Estado vacio que orienta, no que decora.
 *
 * Regla: nunca se muestra un vacio sin una salida. "No hay casos de este cultivo en tu
 * pais todavia" va siempre acompanado de a donde ir en su lugar. El icono existe para que
 * el vacio no parezca un error de la pagina.
 */
export function EmptyState({
  title,
  body,
  icon = "🌾",
  action
}: {
  title: string;
  body: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-start gap-3 border-dashed p-6 sm:p-8">
      <span
        aria-hidden="true"
        className="grid h-14 w-14 place-items-center rounded-card bg-muted text-h2 leading-none"
      >
        {icon}
      </span>
      <h3 className="text-h4 text-foreground">{title}</h3>
      <p className="max-w-prose text-body text-muted-foreground">{body}</p>
      {action ? <div className="mt-1 flex flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
