"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";

/**
 * Guardar y comparar casos, hasta tres (spec, seccion 5).
 *
 * La seleccion vive en localStorage y se comparte entre pestanas con el evento `storage`,
 * mas un evento propio para que el boton y la bandeja se sincronicen dentro de la misma
 * pagina. No toca la base de datos: comparar es una accion del usuario, no un lead.
 */

const KEY = "nano-gro-compare";
const MAX = 3;
const EVENT = "nano-gro-compare-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

function useCompare() {
  const [ids, setIds] = useState<string[]>([]);
  // Se lee en un efecto, no en el primer render, para no romper la hidratacion: el
  // servidor no tiene localStorage y pintaria un estado distinto.
  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return ids;
}

export function CompareToggle({ id, messages }: { id: string; messages: Messages }) {
  const ids = useCompare();
  const selected = ids.includes(id);
  const full = ids.length >= MAX && !selected;

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={full}
      title={full ? messages.compare.full : undefined}
      onClick={() => write(selected ? ids.filter((value) => value !== id) : [...ids, id].slice(0, MAX))}
      className={[
        "min-h-[44px] rounded border px-3 text-caption font-semibold transition-colors",
        selected
          ? "border-data bg-data-tint text-data"
          : "border-border bg-card text-muted-foreground hover:bg-muted",
        full ? "cursor-not-allowed opacity-50" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {selected ? messages.compare.added : messages.compare.add}
    </button>
  );
}

export function CompareTray({ locale, messages }: { locale: Locale; messages: Messages }) {
  const ids = useCompare();
  if (!ids.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 shadow-soft">
      <div className="container flex flex-wrap items-center justify-between gap-3">
        <p className="text-body text-foreground">
          <span className="font-semibold">{messages.compare.trayTitle}</span>{" "}
          <span className="tabular text-muted-foreground">
            {ids.length}/{MAX}
          </span>
        </p>
        <div className="flex gap-2">
          <button className="btn btn-ghost" type="button" onClick={() => write([])}>
            {messages.compare.clear}
          </button>
          <Link className="btn btn-primary" href={`${localizedHref(locale, "/compare")}?ids=${ids.join(",")}`}>
            {messages.compare.trayCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
