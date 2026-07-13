/**
 * La URL publica del sitio, en UN solo lugar.
 *
 * Estaba repetida en 23 archivos con `SITE_URL`.
 * Como la variable no estaba configurada en produccion, TODOS caian al fallback y el sitio
 * publicaba `Sitemap: http://localhost:3000/sitemap.xml` en su robots.txt, ademas de URLs
 * canonicas y hreflang apuntando a una maquina local. Google no puede indexar eso.
 *
 * El fallback ahora es el dominio real. La variable de entorno sigue mandando, para poder
 * apuntar a un entorno de pruebas sin tocar codigo.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.nanogro.lat").replace(/\/$/, "");
