// Compila cada paso (main.ts -> main.js) y genera la guía educativa index.html.
// Uso:  npm run build
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ts from "typescript";

const root = dirname(fileURLToPath(import.meta.url));
let fallos = 0;

// ---- 1) Compilar TypeScript (con revisión de tipos) ----
for (const n of [3, 4, 5, 6, 7]) {
  const cfgPath = join(root, `paso${n}`, "tsconfig.json");
  const cfg = ts.readConfigFile(cfgPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, dirname(cfgPath));
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const result = program.emit();
  const diags = ts.getPreEmitDiagnostics(program).concat(result.diagnostics);
  if (diags.length) {
    fallos++;
    console.error(ts.formatDiagnosticsWithColorAndContext(diags, {
      getCanonicalFileName: (f) => f, getCurrentDirectory: () => root, getNewLine: () => "\n",
    }));
  } else console.log(`paso${n}: main.ts compilado sin errores`);
}
if (fallos) process.exit(1);

// ---- 2) Guía educativa ----
await import("./guia.mjs");
