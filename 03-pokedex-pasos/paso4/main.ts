// ============================================================
// PASO 4 · Datos desde una API (async / await)
// Mismo resultado visual que el paso 3, pero ahora los pokémon se piden
// por internet a PokéAPI. Las tarjetas NO cambian: solo cambia de dónde
// salen los datos.
// ============================================================

// Modelo de la tarjeta (igual que en el paso 3)
interface Pokemon {
  id: number;
  name: string;
  types: string[];
  hp: number;
}

// NUEVO: así se ve lo que devuelve la API. Solo describimos los campos que usamos.
// Fíjate que es más "anidado" que nuestro Pokemon (types es una lista de objetos).
interface PokemonApi {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

// NUEVO: la API de lista solo trae nombre y url de cada pokémon.
interface ListaApi {
  results: { name: string; url: string }[];
}

// NUEVO: dirección base de la API, para no repetirla en cada petición.
const BASE_URL = "https://pokeapi.co/api/v2";

const lista = document.querySelector<HTMLElement>("#lista")!;
const estado = document.querySelector<HTMLElement>("#estado")!;

// NUEVO: función para mostrar mensajes. Si esError es true, el CSS lo pinta en rojo.
function mostrarEstado(texto: string, esError = false): void {
  estado.textContent = texto;
  estado.classList.toggle("error", esError);
}

// NUEVO: getJSON<T> hace UNA petición y devuelve el JSON ya convertido.
//   - async: la función devuelve una promesa (Promise).
//   - await fetch(...): espera la respuesta SIN congelar la página.
//   - <T>: tú le dices qué forma esperas recibir (ListaApi, PokemonApi...).
async function getJSON<T>(url: string): Promise<T> {
  const respuesta = await fetch(url);

  // fetch NO lanza error con un 404 o 500; hay que revisarlo nosotros.
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status} al pedir ${url}`);
  }
  return respuesta.json(); // convierte el texto JSON en un objeto
}

// NUEVO: ADAPTADOR. Convierte la forma de la API a la forma de nuestra tarjeta.
// Gracias a esto, tarjeta() y pintar() siguen exactamente igual que en el paso 3.
function aPokemon(api: PokemonApi): Pokemon {
  // Buscamos la estadística llamada "hp". Si no existe, usamos 0 (operador ??).
  const hp = api.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 0;

  return {
    id: api.id,
    name: api.name,
    types: api.types.map((t) => t.type.name),
    hp,
  };
}

// ----- Igual que en el paso 3 -----
function tarjeta(p: Pokemon): string {
  const chips = p.types.map((t) => `<span class="chip">${t}</span>`).join("");

  return `
    <article class="card">
      <p class="num">#${String(p.id).padStart(3, "0")}</p>
      <h2>${p.name}</h2>
      <p class="tipos">${chips}</p>
      <p class="hp-texto">HP ${p.hp}</p>
      <progress max="200" value="${p.hp}"></progress>
    </article>`;
}

function pintar(items: Pokemon[]): void {
  lista.innerHTML = items.map(tarjeta).join("");
}
// ----------------------------------

// NUEVO: carga los primeros N pokémon desde la API.
async function cargarPokemones(cantidad: number): Promise<void> {
  mostrarEstado("Cargando…");

  // try/catch: si algo falla dentro del try (sin internet, API caída...),
  // el código salta al catch en lugar de romper la página.
  try {
    // Petición 1: la lista (solo nombres y urls)
    const { results } = await getJSON<ListaApi>(`${BASE_URL}/pokemon?limit=${cantidad}`);

    // Petición 2: el detalle de cada pokémon, TODAS A LA VEZ.
    // results.map(...) crea una promesa por pokémon; Promise.all espera a que terminen todas.
    // (Con un await por pokémon, dentro de un for, tardaría mucho más: se sumarían los tiempos.)
    const detalles = await Promise.all(results.map((r) => getJSON<PokemonApi>(r.url)));

    pintar(detalles.map(aPokemon)); // API -> Pokemon -> tarjetas
    mostrarEstado(`Mostrando ${detalles.length} pokémon desde la API`);
  } catch (error) {
    console.error(error); // el detalle técnico queda en la consola (F12)
    mostrarEstado("No se pudo cargar. Revisa tu conexión e intenta de nuevo.", true);
  }
}

// ARRANQUE: pedimos 6 pokémon.
cargarPokemones(120);
