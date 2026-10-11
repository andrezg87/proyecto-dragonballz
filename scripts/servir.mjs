// Servidor local sencillo (sin dependencias) para ver los materiales en el navegador.
// Uso:  npm run servir        →  http://localhost:5500
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || process.argv[2] || 5500);
const tipos = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".md": "text/plain; charset=utf-8", ".ts": "text/plain; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    let ruta = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
    let archivo = join(root, ruta);
    if (!archivo.startsWith(root)) { res.writeHead(403); return res.end("Prohibido"); }
    const info = await stat(archivo).catch(() => null);
    if (info?.isDirectory()) archivo = join(archivo, "index.html");
    const datos = await readFile(archivo);
    res.writeHead(200, { "Content-Type": tipos[extname(archivo)] || "application/octet-stream" });
    res.end(datos);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404: no encontré ese archivo");
  }
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") console.error(`✗ El puerto ${port} está ocupado. Prueba otro:  npm run servir -- 5600`);
  else console.error(e);
  process.exit(1);
});
server.listen(port, () => {
  console.log(`✓ Servidor listo:  http://localhost:${port}`);
  console.log("  Para detenerlo, presiona Ctrl + C.");
});
