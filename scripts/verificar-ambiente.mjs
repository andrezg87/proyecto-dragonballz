// Verifica que tu computador está listo para el curso. No modifica nada.
// Uso:  npm run verificar     (o:  node scripts/verificar-ambiente.mjs)
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { platform } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const resultados = [];
const color = (c, t) => (process.stdout.isTTY ? `\x1b[${c}m${t}\x1b[0m` : t);

function anotar(estado, titulo, detalle = "", arreglo = "") {
  resultados.push({ estado, titulo, detalle, arreglo });
  const icono = estado === "ok" ? color(32, "✓") : estado === "aviso" ? color(33, "!") : color(31, "✗");
  console.log(`${icono} ${titulo}${detalle ? ` — ${detalle}` : ""}`);
  if (arreglo && estado !== "ok") console.log(`    ${color(36, "Cómo arreglarlo:")} ${arreglo}`);
}

function ejecutar(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], cwd: root, timeout: 120000 }).toString().trim();
  } catch (e) {
    return null;
  }
}

console.log("\nVerificando tu ambiente…\n");

/* 1. Node.js */
const major = Number(process.versions.node.split(".")[0]);
if (major >= 20) anotar("ok", "Node.js", `versión ${process.versions.node}`);
else if (major >= 18) anotar("aviso", "Node.js", `versión ${process.versions.node} (funciona, pero se recomienda la 20 o superior)`, "Instala la versión LTS desde https://nodejs.org");
else anotar("error", "Node.js", `versión ${process.versions.node} (demasiado vieja)`, "Instala la versión LTS desde https://nodejs.org y abre una terminal nueva");

/* 2. npm */
const npmV = ejecutar("npm --version");
if (npmV) anotar("ok", "npm", `versión ${npmV}`);
else anotar("error", "npm", "no se encontró", "npm viene con Node.js: reinstala Node.js desde https://nodejs.org y abre una terminal nueva");

/* 3. git */
const gitV = ejecutar("git --version");
if (gitV) {
  anotar("ok", "Git", gitV.replace("git version ", "versión "));
  const nombre = ejecutar("git config --global user.name");
  const correo = ejecutar("git config --global user.email");
  if (nombre && correo) anotar("ok", "Git: identidad configurada", `${nombre} <${correo}>`);
  else anotar("aviso", "Git: falta tu nombre o correo", "", 'Ejecuta:  git config --global user.name "Tu Nombre"   y   git config --global user.email "tu-correo@ejemplo.com"');
} else {
  anotar("error", "Git", "no se encontró (lo necesitas para subir tu proyecto)", platform() === "win32" ? "Instálalo desde https://git-scm.com/downloads/win" : "Instálalo desde https://git-scm.com/downloads (en Mac: escribe  git --version  en la terminal y acepta la instalación)");
}

/* 4. Dependencias del proyecto */
const tsPkg = join(root, "node_modules", "typescript", "package.json");
if (existsSync(tsPkg)) anotar("ok", "Dependencias instaladas", `TypeScript ${JSON.parse(readFileSync(tsPkg, "utf8")).version}`);
else anotar("error", "Dependencias sin instalar", "falta TypeScript", "En la carpeta del repositorio ejecuta:  npm install");

/* 5. Compilación de la Pokédex */
if (existsSync(tsPkg)) {
  const salida = ejecutar("npm run build:pokedex --silent");
  if (salida && salida.includes("sin errores")) anotar("ok", "TypeScript compila la Pokédex", "los pasos 3 a 7 compilan sin errores");
  else anotar("error", "No se pudo compilar la Pokédex", "", "Ejecuta  npm run build:pokedex  y lee el mensaje. Si dice que falta un módulo, ejecuta  npm install");
}

/* 6. Estructura del repositorio */
const carpetas = ["01-clase-html-css", "02-clase-js-ts", "03-pokedex-pasos", "04-proyecto"];
const faltan = carpetas.filter((c) => !existsSync(join(root, c)));
if (faltan.length === 0) anotar("ok", "Carpetas del curso", "completas");
else anotar("error", "Faltan carpetas del repositorio", faltan.join(", "), "Vuelve a clonar el repositorio completo");

/* 7. Internet y APIs */
async function probar(nombre, url) {
  try {
    const r = await fetch(url, { headers: { Origin: "http://localhost:5500" }, signal: AbortSignal.timeout(10000) });
    const cors = r.headers.get("access-control-allow-origin");
    if (r.ok && cors) anotar("ok", `API ${nombre}`, "responde y permite peticiones desde el navegador");
    else if (r.ok) anotar("aviso", `API ${nombre}`, "responde, pero no confirmó CORS desde aquí", "Probablemente funcione igual en el navegador; pruébalo en la clase interactiva");
    else anotar("error", `API ${nombre}`, `respondió con el código ${r.status}`, "Reintenta en unos minutos; si persiste, avísale a tu profesor");
  } catch (e) {
    anotar("error", `API ${nombre}`, "no hay conexión", "Revisa tu internet, VPN o proxy. Sin conexión los pasos que usan la API no funcionan");
  }
}
await probar("PokéAPI", "https://pokeapi.co/api/v2/pokemon/pikachu");
await probar("Dragon Ball", "https://dragonball-api.com/api/characters?limit=1");

/* 8. Opcionales */
const code = ejecutar("code --version");
if (code) anotar("ok", "VS Code", `versión ${code.split("\n")[0]} (comando  code  disponible)`);
else anotar("aviso", "VS Code (opcional)", "no encontré el comando  code", "Instala VS Code desde https://code.visualstudio.com. En Mac: Cmd+Shift+P → «Shell Command: Install 'code' command in PATH»");

const claude = ejecutar("claude --version");
if (claude) anotar("ok", "Claude Code (opcional)", claude);
else anotar("aviso", "Claude Code (opcional)", "no instalado", "Solo si quieres usarlo: mira docs/USAR-IA.md. Puedes aprender igual con el chat de Claude o Gemini");

/* Resumen */
const errores = resultados.filter((r) => r.estado === "error");
const avisos = resultados.filter((r) => r.estado === "aviso");
console.log("");
if (errores.length === 0) {
  console.log(color(32, "✓ Todo listo para empezar.") + (avisos.length ? ` (${avisos.length} aviso${avisos.length > 1 ? "s" : ""} opcional${avisos.length > 1 ? "es" : ""})` : ""));
  console.log("  Siguiente paso:  npm run servir   y abre  http://localhost:5500");
} else {
  console.log(color(31, `✗ Hay ${errores.length} problema${errores.length > 1 ? "s" : ""} por resolver antes de seguir:`));
  errores.forEach((e) => console.log(`   - ${e.titulo}: ${e.arreglo}`));
  console.log("  Cuando lo hagas, vuelve a ejecutar:  npm run verificar");
}
console.log("");
process.exit(errores.length ? 1 : 0);
