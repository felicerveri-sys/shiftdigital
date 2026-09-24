/**
 * BUILD DE PRODUCCION
 *
 * Toma el index.html que editas a mano (con Tailwind y Babel por CDN, comodo
 * para trabajar) y genera en /dist la version que se publica, donde:
 *
 *   - Tailwind CDN (~400 KB, compila en el navegador) -> assets/styles.css (~15 KB, ya compilado)
 *   - Babel standalone (~1.5 MB, compila en el navegador) -> assets/app.js (ya compilado)
 *   - React se sigue tomando de la CDN, con version fija
 *
 * Vos NO tocas /dist: es generado. Segui editando index.html y corre "npm run build".
 */
import { readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { transformAsync } from "@babel/core";

const ejecutar = promisify(execFile);
const RAIZ = new URL("./", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const kb = (t) => (t.length / 1024).toFixed(1) + " KB";

// ---------------------------------------------------------------- 1. Limpiar
await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });

const html = await readFile("index.html", "utf8");

// ------------------------------------------- 2. Extraer y compilar el JSX
const bloqueJsx = html.match(
  /<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/
);
if (!bloqueJsx) throw new Error('No encontre el <script type="text/babel"> en index.html');

const { code: js } = await transformAsync(bloqueJsx[1], {
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  compact: false,
  babelrc: false,
  configFile: false,
});
await writeFile("dist/assets/app.js", js);
console.log("  assets/app.js    " + kb(js));

// ------------------------------------------------- 3. Compilar el Tailwind
// Se invoca el CLI con node directamente (no via npx) para que funcione igual
// en Windows, macOS y en el build de Vercel.
await ejecutar(
  process.execPath,
  ["node_modules/tailwindcss/lib/cli.js", "-i", "./src/input.css", "-o", "./dist/assets/styles.css", "--minify"],
  { cwd: RAIZ }
);
const css = await readFile("dist/assets/styles.css", "utf8");
console.log("  assets/styles.css " + kb(css));

// ------------------------------------------- 4. Reescribir el index.html
let salida = html
  // Fuera el Tailwind CDN y su bloque de configuracion
  .replace(/<!-- Tailwind[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>\s*/, '<link rel="stylesheet" href="./assets/styles.css" />\n')
  // Fuera el Babel del navegador
  .replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^>]*><\/script>/, "")
  .replace("<!-- React 18 + Babel (standalone para prototipado inmediato) -->", "<!-- React 18 (el JSX ya viene compilado en assets/app.js) -->")
  // El JSX inline pasa a ser el archivo ya compilado
  .replace(/<script type="text\/babel"[^>]*>[\s\S]*?<\/script>/, '<script src="./assets/app.js" defer></script>')
  // Ajustar el comentario de la nota al pie
  .replace(/<!--\s*═+\s*NOTA DE PRODUCCION[\s\S]*?-->/, "<!-- Generado por build.mjs a partir de index.html. No editar a mano. -->");

if (salida.includes("cdn.tailwindcss.com") || salida.includes("@babel/standalone")) {
  throw new Error("El dist todavia trae librerias de CDN pesadas: revisa los reemplazos");
}
await writeFile("dist/index.html", salida);
console.log("  index.html        " + kb(salida));

// --------------------------------------------- 5. Copiar videos y posters
if (!existsSync("portfolio/web")) throw new Error("Falta la carpeta portfolio/web");
await cp("portfolio/web", "dist/portfolio/web", { recursive: true });
console.log("  portfolio/web/    (videos y posters)");

console.log("\nListo: /dist esta pronto para publicar.");
