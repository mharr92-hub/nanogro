import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * Extrae las fotografias de campo que viven DENTRO de los informes .docx.
 *
 * Los 61 archivos de imagen del proyecto estaban embebidos en los documentos de Word: la
 * galeria "Antes y despues" salia vacia y los casos no tenian ni una foto, mientras las
 * fotos existian desde el principio.
 *
 * Cada .docx es un ZIP; sus imagenes cuelgan de word/media/. Se copian a
 * public/source-data/photos/<informe>/ conservando el orden, que es el orden en que
 * aparecen en el documento — y ese orden es lo que permite saber cual es el "antes" y cual
 * el "despues" (los informes narran el campo antes de aplicar y luego el muestreo posterior).
 *
 * Idempotente: se puede volver a ejecutar sin duplicar nada.
 */

const SOURCE_DIR = "public/source-data/informes";
const OUT_ROOT = "public/source-data/photos";

const docs = readdirSync(SOURCE_DIR).filter((name) => name.endsWith(".docx"));

let total = 0;

for (const doc of docs) {
  const base = doc.replace(/\.docx$/, "");
  // `unzip` es una herramienta POSIX: en Windows no entiende las barras invertidas.
  const outDir = path.posix.join(OUT_ROOT, base);
  const docPath = path.posix.join(SOURCE_DIR, doc);

  // Se listan las imagenes del zip antes de extraer, para no crear carpetas vacias.
  let entries = [];
  try {
    entries = execSync(`unzip -Z1 "${docPath}" "word/media/*"`, { encoding: "utf8" })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    continue; // el documento no trae imagenes
  }
  if (!entries.length) continue;

  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  /*
   * `unzip` devuelve un codigo distinto de cero cuando encuentra cualquier aviso (por
   * ejemplo, un nombre de archivo con caracteres raros), aunque haya extraido todo
   * correctamente. Se ignora el codigo y se juzga por el resultado: lo que importa es si
   * hay imagenes en la carpeta.
   */
  try {
    execSync(`unzip -o -j "${docPath}" "word/media/*" -d "${outDir}"`, { stdio: "ignore" });
  } catch {
    // seguimos: comprobamos abajo si se extrajo algo
  }
  if (!existsSync(outDir)) continue;

  // Solo formatos que un navegador sabe mostrar. Word guarda a veces .emf/.wmf, que no.
  const kept = readdirSync(outDir).filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file));
  for (const file of readdirSync(outDir)) {
    if (!kept.includes(file)) rmSync(path.posix.join(outDir, file), { force: true });
  }

  if (!kept.length) {
    rmSync(outDir, { recursive: true, force: true });
    continue;
  }

  total += kept.length;
  console.log(`${String(kept.length).padStart(2)}  ${base}`);
}

console.log(`\nfotos extraidas: ${total}`);
