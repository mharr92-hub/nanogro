import { execSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * Transcribe a texto el contenido de los informes .docx.
 *
 * Sirve para que el visitante pueda LEER el informe original dentro de la web, sin
 * descargar nada. Un navegador no sabe abrir un .docx: hasta ahora, la unica forma de ver
 * la fuente era bajarse el archivo y tener Word. Eso expulsa a la mitad de la gente,
 * justo en el momento en que iba a comprobar la evidencia.
 *
 * El .docx es un ZIP y el texto vive en word/document.xml. Se convierte cada parrafo
 * (<w:p>) en un salto de linea y se limpian las etiquetas. No es una conversion perfecta
 * (las tablas quedan como lineas sueltas), y por eso la web lo presenta como
 * "transcripcion del informe original" y mantiene el archivo descargable al lado: quien
 * quiera el documento intacto, lo tiene.
 */

const SOURCE_DIR = "public/source-data/informes";

const transcripts = {};

for (const file of readdirSync(SOURCE_DIR)) {
  if (!file.endsWith(".docx")) continue;
  const docPath = path.posix.join(SOURCE_DIR, file);

  let xml = "";
  try {
    xml = execSync(`unzip -p "${docPath}" word/document.xml`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch {
    continue; // no es un docx valido (hay un .doc renombrado)
  }

  const text = xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    // Word deja rastros binarios: lineas que son solo cifras pegadas (coordenadas de imagen).
    .filter((line) => line && !/^[\d\s.,-]+$/.test(line))
    .join("\n");

  if (text.length > 150) transcripts[file] = text;
}

writeFileSync("lib/case-transcripts.json", `${JSON.stringify(transcripts, null, 2)}\n`, "utf8");

console.log(`informes transcritos: ${Object.keys(transcripts).length}`);
for (const name of Object.keys(transcripts)) console.log(`  ${name}`);
