// Genera index.html: la guía educativa con el código de cada paso, las líneas nuevas
// resaltadas respecto al paso anterior y una vista previa en vivo.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const read = (n, f) => {
  const p = join(root, `paso${n}`, f);
  return existsSync(p) ? readFileSync(p, "utf8").replace(/\s+$/, "") : null;
};

/* ---------- Resaltado de sintaxis (seguro por línea) ---------- */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const wrap = (cls, text) =>
  text.split("\n").map((p) => (p ? `<i class="${cls}">${esc(p)}</i>` : "")).join("\n");

function tokenize(src, re, classify) {
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const cls = classify(m);
    out += cls ? wrap(cls, m[0]) : esc(m[0]);
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}

const KW = new Set("const let var function return if else for while of in await async try catch finally throw new class interface type extends import export from as typeof instanceof null undefined true false void this".split(" "));
const TY = new Set("string number boolean any unknown never object".split(" "));

const highlighters = {
  ts: (src) =>
    tokenize(
      src,
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)/g,
      (m) => (m[1] ? "c" : m[2] ? "s" : m[3] ? "n" : KW.has(m[4]) ? "k" : TY.has(m[4]) || /^[A-Z]/.test(m[4]) ? "t" : null),
    ),
  css: (src) =>
    tokenize(
      src,
      /(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|(--[\w-]+|[a-z-]+(?=\s*:\s))|(#[0-9a-fA-F]{3,8}\b|\b\d[\d.]*(?:px|rem|em|%|s|fr)?)/g,
      (m) => (m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : m[4] ? "n" : null),
    ),
  html: (src) =>
    tokenize(
      src,
      /(<!--[\s\S]*?-->)|(<\/?[A-Za-z][\w-]*|\/?>)|("[^"]*")|(\s[a-z:-]+(?==))/g,
      (m) => (m[1] ? "c" : m[2] ? "k" : m[3] ? "s" : m[4] ? "t" : null),
    ),
};

/* ---------- Diferencias línea a línea (LCS) ---------- */
function diff(a, b) {
  const A = a.split("\n"), B = b.split("\n");
  const L = Array.from({ length: A.length + 1 }, () => new Uint16Array(B.length + 1));
  for (let i = A.length - 1; i >= 0; i--)
    for (let j = B.length - 1; j >= 0; j--)
      L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) {
    if (A[i] === B[j]) { ops.push(["same", j]); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { ops.push(["del", i]); i++; }
    else { ops.push(["add", j]); j++; }
  }
  while (i < A.length) ops.push(["del", i++]);
  while (j < B.length) ops.push(["add", j++]);
  return ops;
}

function renderFile(name, lang, text, prevText) {
  const lines = highlighters[lang](text).split("\n");
  const isNew = prevText == null;
  let rows = "";
  const row = (cls, n, html) =>
    `<div class="ln ${cls}"><span class="no">${n ?? ""}</span><code>${html || " "}</code></div>`;
  let added = 0;
  if (isNew) {
    lines.forEach((h, k) => (rows += row("", k + 1, h)));
  } else {
    const ops = diff(prevText, text);
    let delRun = 0;
    const flush = () => {
      if (delRun) rows += `<div class="ln del"><span class="no">−</span><code>${delRun} ${delRun === 1 ? "línea eliminada" : "líneas eliminadas"} del paso anterior</code></div>`;
      delRun = 0;
    };
    for (const [t, idx] of ops) {
      if (t === "del") { delRun++; continue; }
      flush();
      if (t === "add") added++;
      rows += row(t === "add" ? "add" : "", idx + 1, lines[idx]);
    }
    flush();
  }
  const badge = isNew
    ? `<span class="badge new">archivo nuevo</span>`
    : added
      ? `<span class="badge chg">${added} ${added === 1 ? "línea nueva o cambiada" : "líneas nuevas o cambiadas"}</span>`
      : `<span class="badge same">sin cambios</span>`;
  return `<figure class="file"><figcaption><span class="fname">${name}</span>${badge}</figcaption><div class="codebox">${rows}</div></figure>`;
}

/* ---------- Contenido de cada paso ---------- */
const FILES = [
  ["index.html", "html"],
  ["styles.css", "css"],
  ["main.ts", "ts"],
];

const STEPS = [
  {
    n: 1, title: "HTML: la estructura", time: "10 min",
    goal: "Construir el contenido de la página con HTML puro. No hay colores, ni diseño, ni lógica: se ve “feo” a propósito, para entender qué aporta cada capa que agregamos después.",
    learn: ["Etiquetas semánticas: <code>header</code>, <code>main</code>, <code>section</code>, <code>article</code>", "Atributos <code>class</code> e <code>id</code>", "La etiqueta <code>&lt;progress&gt;</code> (una barra nativa)"],
    changes: ["Creamos <code>index.html</code> con 6 tarjetas escritas a mano, una por pokémon."],
    watch: "Mira lo repetitivo que es copiar y pegar la misma tarjeta 6 veces. Si fueran 1000 pokémon, sería imposible. Ese problema se resuelve en el paso 3.",
    challenge: "Agrega un séptimo pokémon a mano (pikachu, #025, tipo electric, HP 35).",
  },
  {
    n: 2, title: "CSS: el diseño", time: "15 min",
    goal: "Darle aspecto a la página sin tocar el contenido. El HTML casi no cambia: solo enlazamos una hoja de estilos.",
    learn: ["Variables CSS (<code>--acento</code> y <code>var(--acento)</code>)", "Selectores de etiqueta, clase, id y descendiente", "Modelo de caja: padding, borde, margen", "CSS Grid con <code>auto-fill</code> y <code>minmax</code>", "<code>:hover</code> y <code>transition</code>"],
    changes: ["Una línea nueva en el HTML: <code>&lt;link rel=\"stylesheet\" href=\"styles.css\"&gt;</code>.", "Archivo nuevo <code>styles.css</code> con todos los estilos."],
    watch: "Es exactamente el mismo HTML del paso 1. Cambia solo la apariencia. Eso es separar estructura de presentación.",
    challenge: "Cambia <code>--acento</code> por otro color y observa cómo cambia el título.",
  },
  {
    n: 3, title: "Datos en memoria", time: "20 min",
    goal: "Dejar de copiar y pegar HTML. Guardamos los pokémon como datos (un arreglo de objetos) y una función genera las tarjetas.",
    learn: ["<code>interface</code> para describir la forma de un objeto", "Arreglos de objetos (se parecen a un JSON)", "<code>querySelector</code> y <code>innerHTML</code>", "Template strings con <code>${...}</code>", "<code>map()</code> y <code>join()</code> para convertir datos en HTML"],
    changes: ["En <code>index.html</code> se borran las 6 tarjetas: <code>#lista</code> queda vacío y se agrega un <code>&lt;p id=\"estado\"&gt;</code> y el <code>&lt;script&gt;</code>.", "Archivo nuevo <code>main.ts</code> (TypeScript) con los datos, <code>tarjeta()</code> y <code>pintar()</code>.", "Dos reglas nuevas en <code>styles.css</code> para el mensaje de estado."],
    watch: "El resultado visual es el mismo, pero ahora agregar un pokémon es agregar UNA línea de datos. El navegador ejecuta <code>main.js</code>: TypeScript se compila con <code>npm run build</code>.",
    challenge: "Agrega a pikachu al arreglo <code>pokemones</code> y recarga la página.",
  },
  {
    n: 4, title: "Datos desde la API (sin imágenes)", time: "25 min",
    goal: "Los pokémon ya no están escritos en nuestro código: se piden por internet a PokéAPI con <code>fetch</code> y <code>async/await</code>. Las tarjetas no cambian, solo de dónde salen los datos.",
    learn: ["<code>async</code> / <code>await</code> y promesas", "<code>fetch</code> y <code>respuesta.json()</code>", "Revisar <code>respuesta.ok</code> (fetch no falla con un 404)", "<code>try</code> / <code>catch</code> y mensajes de carga y error", "<code>Promise.all</code>: peticiones en paralelo", "Función genérica <code>getJSON&lt;T&gt;</code>", "Un adaptador entre la forma de la API y la de nuestro modelo"],
    changes: ["Se elimina el arreglo en memoria.", "Nuevas interfaces <code>PokemonApi</code> y <code>ListaApi</code> que describen lo que devuelve la API.", "Nuevas funciones <code>getJSON</code>, <code>aPokemon</code>, <code>mostrarEstado</code> y <code>cargarPokemones</code>.", "<code>tarjeta()</code> y <code>pintar()</code> quedan idénticas."],
    watch: "Mientras carga aparece “Cargando…”. Para ver el error, apaga tu internet y recarga: el mensaje en rojo sale gracias al <code>catch</code>.",
    challenge: "Cambia <code>cargarPokemones(6)</code> por <code>cargarPokemones(12)</code>. ¿Cuánto tarda con <code>Promise.all</code>?",
  },
  {
    n: 5, title: "Agregamos las imágenes", time: "10 min",
    goal: "Mostrar la ilustración de cada pokémon. La API ya la incluye en su respuesta: solo hay que leerla, guardarla y pintarla con <code>&lt;img&gt;</code>.",
    learn: ["Leer campos anidados de un JSON (<code>sprites.other[\"official-artwork\"]</code>)", "Tipo unión <code>string | null</code>", "Operador <code>??</code> para valores por defecto", "<code>&lt;img&gt;</code> con <code>alt</code> y <code>loading=\"lazy\"</code>", "<code>object-fit</code> para que la imagen no se deforme"],
    changes: ["<code>Pokemon</code> y <code>PokemonApi</code> suman el campo de la imagen.", "<code>aPokemon()</code> elige qué imagen usar.", "<code>tarjeta()</code> agrega la etiqueta <code>&lt;img&gt;</code>.", "<code>styles.css</code> suma una regla para <code>.card img</code>."],
    watch: "Fíjate en cuántas partes del código se tocan para agregar un dato nuevo: el tipo, el adaptador y la tarjeta. Los tipos de TypeScript te guían a no olvidar ninguna.",
    challenge: "Muestra también el peso (<code>weight</code>) en kilogramos. Recuerda que la API lo da en hectogramos.",
  },
  {
    n: 6, title: "Remate con TailwindCSS", time: "20 min",
    goal: "Reemplazar nuestro <code>styles.css</code> por clases utilitarias de Tailwind. En vez de escribir CSS en otro archivo, describimos el diseño con clases directamente en el HTML.",
    learn: ["Qué es CSS “utility-first” y sus pros y contras", "Clases de espaciado, color, tipografía y bordes", "Diseño responsive con prefijos <code>sm:</code> <code>md:</code> <code>lg:</code>", "Estados con <code>hover:</code>", "<code>Record&lt;string, string&gt;</code> para asignar un color a cada tipo"],
    changes: ["Se agrega el script de Tailwind y se borra el <code>&lt;link&gt;</code>: <b>ya no existe <code>styles.css</code></b>.", "<code>index.html</code> se llena de clases de Tailwind.", "<code>tarjeta()</code> y <code>mostrarEstado()</code> generan clases de Tailwind en lugar de clases propias.", "Nuevo diccionario <code>COLORES_TIPO</code>: cada tipo tiene su color."],
    watch: "El diseño pasa de 1 archivo CSS de ~100 líneas a cero. Lo que ganas en velocidad lo pagas en HTML más largo. Por eso es útil en componentes que se repiten, como estas tarjetas.",
    challenge: "Agrega un color para <code>psychic</code> y <code>ghost</code> en <code>COLORES_TIPO</code>. ¿Cuántas líneas tuviste que tocar?",
  },
  {
    n: 7, title: "El remate: buscador, 251 pokémon y carruseles", time: "30 min",
    goal: "Juntamos todo y lo subimos de nivel: los 251 pokémon de Kanto y Johto, un buscador, filtro por tipo, un carrusel de imágenes dentro de cada tarjeta, un carrusel automático de legendarios, una ventana de detalle y animaciones al pasar el mouse.",
    learn: ["Estado de la aplicación + <code>render()</code>: cambiar datos y volver a dibujar", "Búsqueda y filtros con <code>filter()</code> y el evento <code>input</code>", "Carga por lotes con <code>Promise.all</code> y barra de progreso", "Carruseles solo con CSS (<code>scroll-snap</code>) más un poco de JavaScript", "Delegación de eventos: un solo listener para cientos de botones", "<code>&lt;dialog&gt;</code> nativo y animaciones personalizadas en Tailwind", "<em>Type guards</em>: <code>(c): c is [string, string]</code>"],
    changes: ["<code>Pokemon</code> pasa de una imagen a una galería de hasta 9 (<code>imagenes: Imagen[]</code>), más estadísticas, altura, peso y habilidades.", "Nuevo estado global (<code>todos</code>, <code>busqueda</code>, <code>tipoActivo</code>, <code>mostrar</code>) y una función <code>render()</code> que lo dibuja.", "Nuevas funciones <code>carrusel()</code>, <code>detalleHtml()</code>, <code>filtrados()</code> y los eventos de clic y scroll.", "<code>index.html</code> agrega buscador, filtros, barra de progreso, <code>&lt;dialog&gt;</code> y una configuración de animaciones de Tailwind."],
    watch: "Pasa el mouse sobre una tarjeta: sube, brilla con el color de su tipo y la imagen crece. Escribe <code>char</code> o <code>25</code> en el buscador, filtra por tipo, usa las flechas del carrusel de cada tarjeta y haz clic para abrir el detalle.",
    challenge: "Agrega un botón de favorito (corazón) en cada tarjeta y guarda los ids en <code>localStorage</code>. Después añade un filtro “Solo favoritos”.",
  },
];

/* ---------- Armado de la página ---------- */
const sections = STEPS.map((s) => {
  const filesHtml = FILES.map(([name, lang]) => {
    const cur = read(s.n, name);
    const prev = s.n > 1 ? read(s.n - 1, name) : null;
    if (cur == null) {
      return prev != null
        ? `<figure class="file"><figcaption><span class="fname">${name}</span><span class="badge del">archivo eliminado</span></figcaption><div class="codebox"><div class="ln del"><span class="no">−</span><code>Ya no existe: Tailwind lo reemplaza.</code></div></div></figure>`
        : "";
    }
    return renderFile(name, lang, cur, prev);
  }).join("");
  const hasBuilt = s.n >= 3;
  return `
<section class="step" id="paso${s.n}">
  <p class="kicker">Paso ${s.n} de 7 <span class="time">${s.time}</span></p>
  <h2>${s.title}</h2>
  <p class="goal">${s.goal}</p>
  <div class="two">
    <div class="card"><strong class="lbl">Qué aprendemos</strong><ul>${s.learn.map((x) => `<li>${x}</li>`).join("")}</ul></div>
    <div class="card"><strong class="lbl">Qué cambia respecto al paso anterior</strong><ul>${s.changes.map((x) => `<li>${x}</li>`).join("")}</ul></div>
  </div>
  <div class="card tip"><strong class="lbl">Observa</strong>${s.watch}</div>
  <h3>Código</h3>
  <p class="hint">Las líneas con fondo verde son nuevas o cambiaron. Los comentarios del código explican cada decisión.</p>
  ${filesHtml}
  <h3>Resultado en vivo</h3>
  <div class="preview">
    <div class="pbar"><span>paso${s.n}/index.html</span><a href="paso${s.n}/index.html" target="_blank" rel="noopener">Abrir en pestaña nueva ↗</a></div>
    <iframe src="paso${s.n}/index.html" title="Vista previa del paso ${s.n}" loading="lazy"></iframe>
  </div>
  ${s.n >= 4 ? '<p class="hint">Necesita internet: los datos y las imágenes vienen de pokeapi.co.</p>' : ""}
  <div class="card warn"><strong class="lbl">Reto</strong>${s.challenge}</div>
</section>`;
}).join("\n");

const roadmap = STEPS.map(
  (s) => `<tr><td><a href="#paso${s.n}">Paso ${s.n}</a></td><td>${s.title}</td><td>${s.time}</td></tr>`,
).join("");

const toc = STEPS.map((s) => `<a href="#paso${s.n}">${s.n}. ${s.title}</a>`).join("\n    ");

const css = `
:root{--bg:#f7f7f5;--surface:#fff;--surface-2:#f0efeb;--text:#1d1d1f;--muted:#5f6368;--border:#e2e0da;--accent:#e4572e;--accent-2:#2e86de;--ok:#2a9d5c;--warn:#d99a00;--bad:#c0392b;
  --code-bg:#1e1f24;--code-text:#e6e6e6;--code-muted:#8b8f99;--add-bg:#2a9d5c33;--add-bar:#2a9d5c;--radius:12px}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#121316;--surface:#1b1c20;--surface-2:#24262b;--text:#ececec;--muted:#a3a7ae;--border:#30323a;--accent:#ff7a50;--accent-2:#5aa9f5;--ok:#4cc985;--warn:#f2b632;--bad:#ff7b6b;--code-bg:#0d0e11;--code-muted:#7d818b;--add-bg:#4cc98530;--add-bar:#4cc985;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#121316;--surface:#1b1c20;--surface-2:#24262b;--text:#ececec;--muted:#a3a7ae;--border:#30323a;--accent:#ff7a50;--accent-2:#5aa9f5;--ok:#4cc985;--warn:#f2b632;--bad:#ff7b6b;--code-bg:#0d0e11;--code-muted:#7d818b;--add-bg:#4cc98530;--add-bar:#4cc985;color-scheme:dark}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 Inter,system-ui,sans-serif}
code,pre,kbd{font-family:"JetBrains Mono",ui-monospace,monospace}
a{color:var(--accent-2)}
.layout{display:grid;grid-template-columns:240px minmax(0,1fr);max-width:1240px;margin:0 auto;gap:32px;padding-inline:16px}
nav.toc{position:sticky;top:0;align-self:start;height:100vh;overflow:auto;padding:24px 0;font-size:14px}
nav.toc a{display:block;color:var(--muted);text-decoration:none;padding:4px 10px;border-left:2px solid transparent}
nav.toc a:hover{color:var(--text);border-left-color:var(--accent)}
nav.toc .grp{margin:16px 0 4px;font-weight:600;color:var(--text);font-size:12px;text-transform:uppercase;letter-spacing:.06em}
main{min-width:0;padding-block:24px 80px}
header.hero{padding:40px 0 24px;border-bottom:1px solid var(--border);margin-bottom:24px}
.hero h1{font-size:clamp(32px,6vw,52px);line-height:1.1;margin:0 0 8px;font-weight:800;text-wrap:balance}
.hero h1 span{color:var(--accent)}
.hero p{color:var(--muted);margin:0 0 12px;max-width:64ch}
h2{font-size:28px;margin:4px 0 8px;text-wrap:balance}
h3{font-size:19px;margin:28px 0 6px}
p code,li code,td code,.card code{background:var(--surface-2);border:1px solid var(--border);border-radius:5px;padding:1px 5px;font-size:.88em;overflow-wrap:anywhere}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;margin:12px 0}
.card ul{margin:4px 0 0;padding-left:20px}
.card li{margin:2px 0}
.tip{border-left:4px solid var(--ok)}.warn{border-left:4px solid var(--warn)}.note{border-left:4px solid var(--accent-2)}
.card strong.lbl{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px}
.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.two .card{margin:0}
.step{padding-top:40px;scroll-margin-top:0;border-top:1px solid var(--border);margin-top:40px}
.kicker{margin:0;font:600 12px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.08em;color:var(--accent)}
.time{display:inline-block;background:var(--surface-2);border:1px solid var(--border);border-radius:99px;padding:1px 9px;color:var(--muted);margin-left:6px;letter-spacing:0;text-transform:none}
.goal{font-size:17px;max-width:70ch}
.hint{color:var(--muted);font-size:14px;margin:0 0 8px}
.tablewrap{overflow-x:auto;margin:12px 0}
table{width:100%;border-collapse:collapse;background:var(--surface);min-width:420px}
th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--border)}
th{background:var(--surface-2);font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.file{margin:12px 0;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;background:var(--code-bg)}
.file figcaption{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center;padding:6px 14px;background:var(--surface-2);border-bottom:1px solid var(--border);font-size:13px}
.fname{font-family:"JetBrains Mono",monospace;font-weight:600}
.badge{font-size:12px;padding:1px 9px;border-radius:99px;border:1px solid var(--border);color:var(--muted)}
.badge.new{color:var(--accent-2);border-color:var(--accent-2)}.badge.chg{color:var(--ok);border-color:var(--ok)}.badge.del{color:var(--bad);border-color:var(--bad)}
.codebox{overflow-x:auto;padding:8px 0;font-size:13px;line-height:1.55;color:var(--code-text)}
.ln{display:grid;grid-template-columns:44px max-content;min-width:100%;border-left:3px solid transparent}
.ln .no{text-align:right;padding-right:12px;color:var(--code-muted);user-select:none;font:12px/1.55 "JetBrains Mono",monospace}
.ln code{white-space:pre;padding-right:16px}
.ln.add{background:var(--add-bg);border-left-color:var(--add-bar)}
.ln.del{color:var(--bad);font-style:italic;border-left-color:var(--bad);background:#c0392b1a}
.ln i{font-style:normal}.c{color:var(--code-muted)}.s{color:#8fd694}.n{color:#f0a76e}.k{color:#7fb8f5}.t{color:#e3b6f0}
.preview{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;background:#fff}
.pbar{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;padding:6px 14px;background:var(--surface-2);border-bottom:1px solid var(--border);font:13px "JetBrains Mono",monospace;color:var(--muted)}
.pbar a{font-family:Inter,system-ui,sans-serif}
.preview iframe{display:block;width:100%;height:520px;border:0;background:#fff}
.theme-btn{position:fixed;right:16px;bottom:16px;z-index:5;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:99px;padding:8px 14px;cursor:pointer;font:600 13px Inter,sans-serif}
footer{color:var(--muted);font-size:14px;border-top:1px solid var(--border);margin-top:56px;padding-top:16px}
pre.cmd{background:var(--code-bg);color:var(--code-text);padding:12px 16px;border-radius:10px;overflow-x:auto;font-size:13.5px}
:focus-visible{outline:2px solid var(--accent-2);outline-offset:2px}
@media (max-width:860px){.layout{grid-template-columns:minmax(0,1fr);gap:0}nav.toc{display:none}.two{grid-template-columns:minmax(0,1fr)}}
`;

const page = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Pokédex paso a paso</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<button class="theme-btn" id="themeBtn" aria-label="Cambiar tema">◐ Tema</button>
<div class="layout">
<nav class="toc" aria-label="Índice">
  <div class="grp">Inicio</div>
  <a href="#ruta">Ruta de 7 pasos</a>
  <a href="#uso">Cómo usar esta guía</a>
  <div class="grp">Pasos</div>
  ${toc}
  <div class="grp">Cierre</div>
  <a href="#resumen">Resumen</a>
</nav>
<main>
<header class="hero">
  <h1>Mini Pokédex <span>paso a paso</span></h1>
  <p>Construimos la misma página siete veces, cada vez con una capa más: HTML, CSS, datos en memoria, datos desde una API, imágenes, TailwindCSS y un remate con buscador, 251 pokémon y carruseles. Cada paso muestra su código comentado, resalta qué cambió y trae el resultado en vivo.</p>
</header>

<h2 id="ruta">Ruta de 7 pasos</h2>
<div class="tablewrap"><table>
<tr><th>Paso</th><th>Qué hacemos</th><th>Tiempo</th></tr>
${roadmap}
</table></div>

<h2 id="uso">Cómo usar esta guía</h2>
<div class="card note"><strong class="lbl">Estructura de la carpeta</strong>
Cada paso vive en su carpeta (<code>paso1</code> … <code>paso7</code>) y funciona por sí solo: abre su <code>index.html</code> en el navegador. Los pasos 3 a 7 usan TypeScript: el archivo que escribes es <code>main.ts</code> y el navegador ejecuta <code>main.js</code>, que se genera al compilar.</div>
<pre class="cmd">npm install        # una sola vez: instala TypeScript
npm run build      # compila cada main.ts a main.js, revisa los tipos y regenera esta guía</pre>
<div class="card tip"><strong class="lbl">Para clase</strong>
Pide a los estudiantes que copien la carpeta <code>paso1</code>, la abran en VS Code y avancen paso a paso comparando con esta guía. Los pasos 4 a 7 necesitan internet.</div>
<div class="card warn"><strong class="lbl">Leyenda</strong>
<span style="background:var(--add-bg);border-left:3px solid var(--add-bar);padding:1px 8px">Línea nueva o cambiada respecto al paso anterior</span> · <span style="color:var(--bad);font-style:italic">Líneas eliminadas (resumen)</span></div>

${sections}

<h2 id="resumen" style="margin-top:56px">Resumen: qué capa hace qué</h2>
<div class="tablewrap"><table>
<tr><th>Capa</th><th>Responde a…</th><th>Dónde la vimos</th></tr>
<tr><td>HTML</td><td>¿Qué hay en la página?</td><td>Paso 1</td></tr>
<tr><td>CSS / Tailwind</td><td>¿Cómo se ve?</td><td>Pasos 2, 6 y 7</td></tr>
<tr><td>Datos en memoria</td><td>¿De dónde salen los datos? (de nuestro código)</td><td>Paso 3</td></tr>
<tr><td>API con <code>async/await</code></td><td>¿De dónde salen los datos? (de internet, y puede fallar)</td><td>Pasos 4 y 5</td></tr>
<tr><td>TypeScript</td><td>¿Qué forma tienen los datos? Errores antes de ejecutar</td><td>Pasos 3 a 7</td></tr>
</table></div>
<div class="card note"><strong class="lbl">Siguientes pasos</strong>
Favoritos guardados en <code>localStorage</code>, ordenar por estadísticas, comparar dos pokémon o pasar el proyecto a Vite. Tailwind desde CDN es solo para aprender: en un proyecto real se instala con npm.</div>
<footer>Guía de estudio · Mini Pokédex paso a paso. Los datos de pokémon pertenecen a PokéAPI.</footer>
</main>
</div>
<script>
document.getElementById('themeBtn').addEventListener('click', function () {
  var root = document.documentElement;
  var isDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = isDark ? 'light' : 'dark';
});
</script>
</body>
</html>
`;

writeFileSync(join(root, "index.html"), page);
console.log("guía generada: index.html");
