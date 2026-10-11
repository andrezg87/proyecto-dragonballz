// Guardarraíl pedagógico para Claude Code.
// Se ejecuta ANTES de cada Write / Edit / Bash. Si Claude intenta escribir el código que el
// estudiante debe acomodar (HTML, CSS, TS o JS de dragonball/), o tocar la configuración del
// tutor, se bloquea y se le explica a Claude qué hacer en su lugar: entregar el código en el chat
// para que el estudiante lo acomode él mismo en VS Code.
//
// Nota honesta: esto es una barrera de fricción, no de seguridad. El estudiante es dueño de su
// computador y podría desactivarla; hacerlo es saltarse justo la parte donde se aprende.
import { readFileSync } from "node:fs";

let entrada = {};
try { entrada = JSON.parse(readFileSync(0, "utf8")); } catch { process.exit(0); }

const { tool_name: herramienta, tool_input: datos = {} } = entrada;
const norm = (p = "") => String(p).replace(/\\/g, "/");

const CODIGO_ESTUDIANTE = /04-proyecto\/dragonball\/.*\.(ts|html|css|js|map)$/i;
const README_ESTUDIANTE = /04-proyecto\/dragonball\/README\.md$/i;
const CONFIG_TUTOR = /(^|\/)(\.claude\/|CLAUDE\.md$)/;
const MATERIAL_CLASE = /(^|\/)(00-repaso-rapido|01-clase-html-css|02-clase-js-ts|03-pokedex-pasos)\//;
const ENUNCIADO = /04-proyecto\/(proyecto-estudiante|wireframe-dragonball)\.html$/;

const MSG_CODIGO =
  "BLOQUEADO por el tutor: no escribes los archivos del estudiante; él los acomoda. " +
  "Entrega el código EN EL CHAT, en una pieza pequeña, indicando el archivo destino, el lugar exacto donde pegarlo y por qué va ahí. " +
  "Luego pídele que lo pegue, lo ejecute (npm run build) y te explique con sus palabras qué hace antes de pasar a la siguiente pieza.";
const MSG_README =
  "BLOQUEADO por el tutor: el README del estudiante contiene SUS respuestas de análisis, que deben estar en sus propias palabras. " +
  "No lo escribas ni lo reescribas. Puedes decirle si una explicación suya tiene un error conceptual y por qué, sin darle el texto.";
const MSG_TUTOR =
  "BLOQUEADO: esa configuración del tutor no se modifica desde la sesión. Si el estudiante cree que algo está mal, que se lo diga a su profesor.";
const MSG_CLASE =
  "BLOQUEADO: los materiales de clase son de solo lectura. Puedes leerlos y explicarlos, no modificarlos.";

const MSG_GIT =
  "BLOQUEADO por el tutor: los comandos de Git los escribe el estudiante, para que aprenda qué hace cada uno. " +
  "Explícale qué hace el comando (qué cambia y dónde: carpeta, historial local o GitHub), dile exactamente cuál escribir y por qué, " +
  "y pídele que lo ejecute él. Después puedes verificar el resultado con git status, git log --oneline o git branch.";

function bloquear(mensaje) {
  process.stderr.write(mensaje + "\n");
  process.exit(2);
}

function revisarRuta(ruta) {
  const p = norm(ruta);
  if (CONFIG_TUTOR.test(p)) bloquear(MSG_TUTOR);
  if (README_ESTUDIANTE.test(p)) bloquear(MSG_README);
  if (CODIGO_ESTUDIANTE.test(p)) bloquear(MSG_CODIGO);
  if (MATERIAL_CLASE.test(p) || ENUNCIADO.test(p)) bloquear(MSG_CLASE);
}

if (["Write", "Edit", "MultiEdit", "NotebookEdit"].includes(herramienta)) {
  revisarRuta(datos.file_path || datos.notebook_path);
}

// Subcomandos de Git que cambian el repositorio: los ejecuta el estudiante.
const GIT_ESCRIBE = new Set(["add", "commit", "push", "pull", "fetch", "checkout", "switch", "merge", "rebase", "reset", "restore", "stash", "clone", "init", "rm", "mv", "tag", "cherry-pick", "revert"]);
function revisarGit(cmd) {
  const re = /(^|[;&|(]\s*|&&\s*)git\s+(?:-[Cc]\s+\S+\s+)*([a-z][a-z-]*)\s*([^;&|]*)/g;
  let m;
  while ((m = re.exec(cmd))) {
    const sub = m[2];
    const resto = m[3].trim();
    if (GIT_ESCRIBE.has(sub)) bloquear(MSG_GIT);
    if (sub === "branch" && resto && !/^(-a|-r|-v|-vv|--list|--show-current|--all)\b/.test(resto)) bloquear(MSG_GIT);
    if (sub === "remote" && /^(add|set-url|remove|rm|rename)\b/.test(resto)) bloquear(MSG_GIT);
  }
}

if (herramienta === "Bash") {
  const cmd = norm(datos.command);
  revisarGit(cmd);
  // Comandos mecánicos permitidos explícitamente
  const permitido = /^\s*(npm (run )?(install|i|ci|run build|run build:pokedex|run nivel|run verificar|run servir|test)|node scripts\/|node build\.mjs|npx tsc|cd [^;&|]*&&\s*npm )/.test(cmd) &&
    !/[>|]\s*\S*(\.ts|\.html|\.css|\.js)\b/.test(cmd);
  if (!permitido) {
    const escribe = /(^|[\s;&|(])(tee|sed\s+-i|perl\s+-pi|cp|mv|rm|dd|truncate|touch|python3?|node\s+-e|perl|ruby)\b|>>?|<<|Set-Content|Out-File|Add-Content|New-Item|Remove-Item/i.test(cmd);
    if (escribe) {
      if (CONFIG_TUTOR.test(cmd) || /(^|[\s"'/])\.claude(\/|\b)/.test(cmd) || /CLAUDE\.md/.test(cmd)) bloquear(MSG_TUTOR);
      if (/04-proyecto\/dragonball\/README\.md|dragonball\/README\.md/.test(cmd)) bloquear(MSG_README);
      if (/dragonball\/[^\s"']*\.(ts|html|css|js|map)\b|dragonball\/nivel\d+/i.test(cmd)) bloquear(MSG_CODIGO);
      if (/(00-repaso-rapido|01-clase-html-css|02-clase-js-ts|03-pokedex-pasos)\//.test(cmd)) bloquear(MSG_CLASE);
    }
  }
}

process.exit(0);
