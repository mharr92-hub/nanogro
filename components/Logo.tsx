/**
 * Marca Nano-Gro.
 *
 * Reconstruida como SVG vectorial a partir del logo original: la cupula de curvas de nivel
 * (verde en el borde, amarillo en el centro) con su anillo azul, el logotipo "Nano-Gro" y el
 * descriptor "Nanotecnologia Agricola".
 *
 * Es vectorial a proposito: se usa en la cabecera, en el favicon y en la imagen de
 * previsualizacion de WhatsApp, y en los tres sitios tiene que verse nitido sin que el
 * agricultor descargue un PNG pesado.
 *
 * Si mas adelante teneis el archivo original de marca, sustituid este componente por la
 * imagen oficial; el resto del sitio no se entera.
 */

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Nano-Gro"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ng-dome" cx="50%" cy="58%" r="62%">
          <stop offset="0%" stopColor="#e9e14a" />
          <stop offset="42%" stopColor="#a8c93a" />
          <stop offset="72%" stopColor="#3f9440" />
          <stop offset="100%" stopColor="#1c5f2c" />
        </radialGradient>
      </defs>

      {/* Anillo azul exterior */}
      <circle cx="32" cy="32" r="29" fill="none" stroke="#2b2fa8" strokeWidth="4" />

      {/* Cupula: el campo visto en curvas de nivel */}
      <circle cx="32" cy="32" r="25" fill="url(#ng-dome)" />

      {/* Curvas de nivel */}
      <g fill="none" stroke="#1c5f2c" strokeOpacity="0.45" strokeWidth="1">
        <ellipse cx="32" cy="34" rx="20" ry="14" />
        <ellipse cx="32" cy="35" rx="15" ry="10" />
        <ellipse cx="32" cy="36" rx="10" ry="6.5" />
        <ellipse cx="32" cy="37" rx="5" ry="3" />
      </g>
    </svg>
  );
}

/** Marca completa: símbolo + logotipo. La que va en la cabecera. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={["inline-flex items-center gap-2.5", className].filter(Boolean).join(" ")}>
      <LogoMark className="h-9 w-9 flex-none" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-h4 font-bold tracking-tight text-primary">Nano-Gro</span>
        <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
          Nanotecnología Agrícola
        </span>
      </span>
    </span>
  );
}
