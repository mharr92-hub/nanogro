import type { ElementType, ReactNode } from "react";

export function Card({
  as: Tag = "div",
  padded = true,
  className = "",
  children
}: {
  as?: ElementType;
  padded?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={["card", padded ? "p-5" : "", className].filter(Boolean).join(" ")}>{children}</Tag>;
}

export function CardHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-label font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-h3 text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  );
}
