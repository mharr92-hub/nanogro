import Link from "next/link";
import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-brand-dark">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "amber" | "blue";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "brand" && "bg-brand-light text-brand-dark",
        tone === "neutral" && "bg-gray-100 text-gray-700",
        tone === "amber" && "bg-amber-100 text-amber-800",
        tone === "blue" && "bg-blue-100 text-blue-800",
      )}
    >
      {children}
    </span>
  );
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition",
        variant === "primary" && "bg-brand text-white hover:bg-brand-dark",
        variant === "secondary" && "border border-border bg-white text-brand-dark hover:bg-brand-light",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-tight text-foreground">{children}</h2>;
}
