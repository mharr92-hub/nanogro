import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import mammoth from "mammoth";

/**
 * Convierte los informes .docx al documento ORIGINAL, legible en el navegador.
 *
 * La transcripcion a texto plano servia para leer, pero no para CREER: un informe de campo
 * sin sus tablas, sus fotos ni su encabezado no parece un documento, parece un resumen que
 * ha escrito alguien. Y en una plataforma de evidencia, ver el documento tal como es cambia
 * por completo la perspectiva de quien lo mira.
 *
 * Mammoth reconstruye el .docx en HTML conservando lo que importa: titulos, parrafos,
 * TABLAS (donde viven las mediciones) e IMAGENES (las fotos de campo, embebidas en el
 * propio documento). No es un pixel-perfect de Word y no pretende serlo: es el documento,
 * con su estructura y sus fotos, servido desde nuestro dominio, sin depender de nadie ni
 * mandar los informes a un visor de terceros.
 *
 * Cada informe se escribe como un HTML INDEPENDIENTE en public/, no dentro de un JSON: el
 * conjunto pesa 12 MB y meterlo en el bundle lo cargaria en cada render de cada pagina.
 * Asi solo se descarga cuando alguien abre ese informe concreto.
 */

const SOURCE_DIR = "public/source-data/informes";
const OUT_DIR = "public/source-data/reports";
const INDEX_FILE = "lib/case-reports.json";

/** Hoja de estilo del visor: que se lea como un documento, no como una pagina web. */
const STYLE = `
  :root { color-scheme: light; }
  body {
    margin: 0;
    padding: 32px 28px 64px;
    background: #ffffff;
    color: #171a16;
    font-family: Calibri, Carlito, "Segoe UI", system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    max-width: 900px;
    margin-inline: auto;
  }
  h1, h2, h3 { line-height: 1.25; margin: 1.4em 0 .5em; }
  p { margin: 0 0 .9em; }
  img { max-width: 100%; height: auto; display: block; margin: 1.2em auto; border-radius: 4px; }
  table { border-collapse: collapse; width: 100%; margin: 1.4em 0; font-size: 15px; }
  td, th { border: 1px solid #d3d7d0; padding: 8px 10px; vertical-align: top; text-align: left; }
  th, tr:first-child td { background: #f2f4f0; font-weight: 600; }
  @media (max-width: 640px) { body { padding: 20px 16px 48px; font-size: 15px; } table { font-size: 13px; } }
`;

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

/** Mapa: nombre del .docx -> ruta publica de su HTML. */
const index = {};

for (const file of readdirSync(SOURCE_DIR)) {
  if (!file.endsWith(".docx")) continue;

  try {
    const { value } = await mammoth.convertToHtml(
      { path: path.join(SOURCE_DIR, file) },
      {
        // Las fotos del informe viajan dentro del propio HTML: el documento nunca se rompe.
        convertImage: mammoth.images.imgElement(async (image) => ({
          src: `data:${image.contentType};base64,${await image.read("base64")}`
        }))
      }
    );

    if (!value || value.length < 200) continue;

    const name = file.replace(/\.docx$/i, ".html");
    const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${file.replace(/\.docx$/i, "")}</title>
<style>${STYLE}</style>
</head>
<body>
${value}
</body>
</html>
`;

    writeFileSync(path.join(OUT_DIR, name), html, "utf8");
    index[file] = `/source-data/reports/${name}`;
    console.log(`${String(Math.round(html.length / 1024)).padStart(5)} KB  ${name}`);
  } catch (error) {
    console.log(`    --  ${file}  (no convertible: ${error.message.slice(0, 60)})`);
  }
}

writeFileSync(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(`\ninformes convertidos: ${Object.keys(index).length}`);
