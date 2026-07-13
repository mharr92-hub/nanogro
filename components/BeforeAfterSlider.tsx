"use client";

import Image from "next/image";
import { useState } from "react";
import type { EvidenceAsset } from "@/lib/types";

/**
 * Comparador deslizable antes/despues.
 *
 * Es un <input type="range"> nativo por encima de las dos imagenes: se arrastra con el
 * dedo, se mueve con las flechas del teclado y lo anuncia un lector de pantalla sin que
 * tengamos que inventar nada. Los widgets de "cortina" hechos con listeners de puntero
 * suelen no ser accesibles; este lo es gratis.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  hint
}: {
  before: EvidenceAsset;
  after: EvidenceAsset;
  beforeLabel: string;
  afterLabel: string;
  hint: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <figure className="card overflow-hidden p-0">
      <div className="relative aspect-[4/3] w-full select-none">
        <Image
          alt={after.alt_text?.trim() || afterLabel}
          className="object-cover"
          src={after.file_url}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          {/* La imagen "antes" se recorta a la izquierda. Ancho fijo al 100% del contenedor
              padre para que no se deforme al mover el control. */}
          <div className="relative h-full" style={{ width: `${100 / (position / 100)}%`, maxWidth: "none" }}>
            <Image
              alt={before.alt_text?.trim() || beforeLabel}
              className="object-cover"
              src={before.file_url}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-card"
          style={{ left: `${position}%` }}
        />

        <span className="absolute left-3 top-3 rounded-pill bg-foreground/80 px-2 py-1 text-caption font-semibold text-background">
          {beforeLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-pill bg-foreground/80 px-2 py-1 text-caption font-semibold text-background">
          {afterLabel}
        </span>
      </div>

      <figcaption className="border-t border-border p-4">
        <label className="field-label">
          {hint}
          <input
            className="w-full"
            type="range"
            min={0}
            max={100}
            step={1}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label={`${beforeLabel} / ${afterLabel}`}
          />
        </label>
      </figcaption>
    </figure>
  );
}
