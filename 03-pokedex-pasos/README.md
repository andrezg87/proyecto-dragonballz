# 03 · Pokédex paso a paso

**Qué es:** la misma página construida siete veces, cada vez con una capa más. Es tu **referencia** para el proyecto: aquí ves cómo se hace; en el proyecto lo haces tú con otra API.

| Paso | Qué agrega |
|---|---|
| `paso1/` | HTML puro: 6 tarjetas escritas a mano |
| `paso2/` | CSS: variables, Grid, `:hover` |
| `paso3/` | Datos en memoria con TypeScript (`interface`, arreglo, `tarjeta()`, `pintar()`) |
| `paso4/` | Datos desde la API con `async/await`, `try/catch` y `Promise.all` |
| `paso5/` | Imágenes |
| `paso6/` | TailwindCSS |
| `paso7/` | El remate: buscador, 251 pokémon, carruseles, ventana de detalle y animaciones |

**Cómo usarla**

- **Lo más fácil:** `npm run servir` desde la raíz del repositorio y abre <http://localhost:5500/03-pokedex-pasos/>. Es la guía educativa con el código comentado de cada paso, las líneas nuevas resaltadas y el resultado en vivo.
- Cada paso funciona solo: abre `pasoN/index.html`.
- Los pasos 3 a 7 están escritos en **TypeScript** (`main.ts`). El navegador ejecuta `main.js`, que ya viene compilado.

**Si modificas un `main.ts` para experimentar** (puedes; es tu copia):

```bash
npm run build:pokedex
```

Esto recompila los `.ts`, revisa los tipos y regenera la guía. Luego recarga el navegador con `Ctrl+Shift+R` (`Cmd+Shift+R` en Mac).

**Qué mirar con atención** (te va a servir en el proyecto)

- En el paso 4: la función genérica `getJSON<T>`, la revisión de `respuesta.ok`, el `try/catch` y el **adaptador** `aPokemon()`.
- En el paso 7: el patrón **estado + `render()`**, la **delegación de eventos** y la carga **por lotes**.
