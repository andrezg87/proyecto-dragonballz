// Crea la carpeta de un nivel con lo MECÁNICO ya listo (tsconfig.json y un main.ts vacío).
// El contenido (HTML, CSS y TypeScript) lo acomodas tú: la IA te propone cada pieza y tú decides dónde va.
// Uso:  npm run nivel -- 3
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const n = Number(process.argv[2]);

if (!Number.isInteger(n) || n < 1 || n > 8) {
  console.error("Indica el número del nivel (1 a 8). Ejemplo:  npm run nivel -- 3");
  process.exit(1);
}

const dir = join(root, `nivel${n}`);
if (existsSync(dir)) {
  console.log(`La carpeta nivel${n}/ ya existe. No se cambió nada.`);
  process.exit(0);
}
mkdirSync(dir);

if (n >= 3) {
  writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({ extends: "../tsconfig.base.json", include: ["main.ts"] }, null, 2) + "\n");
  writeFileSync(join(dir, "main.ts"), `// Nivel ${n}: aquí acomodas tu código TypeScript, pieza por pieza.\n// Cuando quieras probarlo:  npm run build   (genera main.js, que es el que carga el navegador)\n`);
  console.log(`✓ Creada nivel${n}/ con tsconfig.json y main.ts. Falta acomodar tu index.html.`);
} else {
  console.log(`✓ Creada nivel${n}/. Acomoda tu index.html${n === 2 ? " y el styles.css" : ""}.`);
}
