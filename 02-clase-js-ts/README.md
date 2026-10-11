# 02 · Clase de JavaScript y TypeScript

**Qué es:** la guía interactiva de la clase de hoy. Todos los ejemplos de código se pueden **editar y ejecutar** (botón ▶ o `Ctrl/⌘ + Enter`) y muestran la salida en una consola a la derecha. Los ejemplos de TypeScript revisan tus tipos en vivo y muestran el JavaScript resultante.

**Cómo abrirla:**

- Con el servidor del curso: `npm run servir` y entra a <http://localhost:5500/02-clase-js-ts/clase-js-ts.html>
- O con doble clic sobre [`clase-js-ts.html`](clase-js-ts.html).

**Qué contiene (2 horas):**

1. Qué es una API, HTTP, JSON y PokéAPI.
2. JavaScript para trabajar con datos: objetos, destructuring, `map`, `filter`, `reduce`.
3. Asincronía, promesas y `async/await` a fondo, con un ejemplo básico de `fetch`.
4. TypeScript: tipos, uniones, interfaces, genéricos, utility types, tipar la respuesta de una API, `unknown` y type guards.
5. Un proyecto: Mini Pokédex con búsqueda.

**Importante: de dónde salen los datos.** Al inicio hay un selector **«Origen de los datos de PokéAPI»**:

- *Automático*: usa la API real si tu navegador puede conectarse; si no, usa una muestra local con la misma forma. Es lo recomendado.
- *Siempre simulados*: una muestra de 16 pokémon, sin internet.
- *Solo API real*: falla si no hay conexión.

Los ejemplos de TypeScript cargan el compilador desde internet, así que necesitas conexión para esa parte.
