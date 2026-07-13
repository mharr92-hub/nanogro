/**
 * Icono decorativo.
 *
 * Siempre `aria-hidden`: un lector de pantalla que anuncia "emoji mazorca de maiz" antes
 * de cada nombre de cultivo convierte un listado en ruido. El icono acompana al texto,
 * nunca lo sustituye, asi que no hay informacion que se pierda al ocultarlo.
 */
export function Emoji({ symbol, className = "" }: { symbol: string; className?: string }) {
  return (
    <span aria-hidden="true" className={["select-none leading-none", className].filter(Boolean).join(" ")}>
      {symbol}
    </span>
  );
}

/** Icono dentro de una pastilla de color, para encabezados de seccion y metricas. */
export function IconBadge({
  symbol,
  tone = "leaf",
  className = ""
}: {
  symbol: string;
  tone?: "leaf" | "data" | "muted";
  className?: string;
}) {
  const toneClass = {
    leaf: "bg-accent",
    data: "bg-data-tint",
    muted: "bg-muted"
  }[tone];

  return (
    <span
      aria-hidden="true"
      className={[
        "inline-grid h-10 w-10 flex-none place-items-center rounded-card text-h4 leading-none",
        toneClass,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {symbol}
    </span>
  );
}
