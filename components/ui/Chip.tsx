import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Chip de filtro. Con `count` muestra el contador de facetas que pide la spec
 * ("faceted filters with instant counts"). Un contador en cero se muestra
 * atenuado en lugar de ocultarse: saber que no hay casos tambien es informacion.
 */
export function FilterChip({
  href,
  active = false,
  count,
  children
}: {
  href: string;
  active?: boolean;
  count?: number;
  children: ReactNode;
}) {
  const empty = count === 0;
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={[
        "inline-flex min-h-[44px] items-center gap-2 rounded-pill border px-4 py-2 text-body font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground hover:text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
        empty && !active ? "opacity-55" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {typeof count === "number" ? (
        <span
          className={[
            "tabular text-caption",
            active ? "text-primary-foreground/80" : "text-muted-foreground"
          ].join(" ")}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
