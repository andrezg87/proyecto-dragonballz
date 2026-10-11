"use strict";
// ============================================================
// PASO 6 · TailwindCSS
// La lógica es la misma del paso 5. Lo único que cambia es el HTML que
// genera tarjeta(): en vez de class="card" (CSS propio), usa clases de Tailwind.
// ============================================================
// Dirección base de la API, para no repetirla en cada petición.
const BASE_URL = "https://pokeapi.co/api/v2";
// NUEVO: un color por tipo de pokémon.
// Record<string, string> = un diccionario: la clave es el nombre del tipo y el valor son clases de Tailwind.
const COLORES_TIPO = {
    grass: "bg-green-100 text-green-800",
    poison: "bg-purple-100 text-purple-800",
    fire: "bg-orange-100 text-orange-800",
    flying: "bg-sky-100 text-sky-800",
    water: "bg-blue-100 text-blue-800",
    electric: "bg-yellow-100 text-yellow-800",
};
// Si un tipo no está en el diccionario usaremos este color neutro.
const COLOR_POR_DEFECTO = "bg-slate-100 text-slate-700";
const lista = document.querySelector("#lista");
const estado = document.querySelector("#estado");
// CAMBIO: antes alternábamos la clase CSS "error". Ahora alternamos las clases de Tailwind
// que pintan el texto de gris o de rojo.
function mostrarEstado(texto, esError = false) {
    estado.textContent = texto;
    estado.className = esError
        ? "mb-4 min-h-6 text-center font-semibold text-red-600"
        : "mb-4 min-h-6 text-center text-slate-500";
}
// getJSON<T> hace UNA petición y devuelve el JSON ya convertido.
//   - async: la función devuelve una promesa (Promise).
//   - await fetch(...): espera la respuesta SIN congelar la página.
//   - <T>: tú le dices qué forma esperas recibir (ListaApi, PokemonApi...).
async function getJSON(url) {
    const respuesta = await fetch(url);
    // fetch NO lanza error con un 404 o 500; hay que revisarlo nosotros.
    if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status} al pedir ${url}`);
    }
    return respuesta.json(); // convierte el texto JSON en un objeto
}
// ADAPTADOR. Convierte la forma de la API a la forma de nuestra tarjeta.
// Aquí es donde "elegimos" la imagen: es el único lugar que conoce la forma de la API.
function aPokemon(api) {
    // Buscamos la estadística llamada "hp". Si no existe, usamos 0 (operador ??).
    const hp = api.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 0;
    // Probamos la ilustración grande; si no existe, el sprite pequeño; si no, texto vacío.
    const imagen = api.sprites.other["official-artwork"].front_default ?? api.sprites.front_default ?? "";
    return {
        id: api.id,
        name: api.name,
        types: api.types.map((t) => t.type.name),
        hp,
        imagen, // abreviatura de  imagen: imagen
    };
}
function tarjeta(p) {
    // CAMBIO: cada chip toma su color del diccionario (o el neutro si no existe).
    const chips = p.types
        .map((t) => {
        const color = COLORES_TIPO[t] ?? COLOR_POR_DEFECTO;
        return `<span class="rounded-full px-2.5 py-0.5 text-xs font-medium ${color}">${t}</span>`;
    })
        .join("");
    // CAMBIO: ya no hay class="card", "chip"... sino utilidades de Tailwind. Se leen casi como español:
    //   rounded-2xl  esquinas muy redondeadas     p-4        padding de 1rem
    //   shadow-sm    sombra suave                 hover:...  se aplica solo con el mouse encima
    //   capitalize   primera letra en mayúscula   object-contain  la imagen no se deforma
    return `
    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img class="mx-auto mb-2 h-24 w-24 object-contain" src="${p.imagen}" alt="Ilustración de ${p.name}" loading="lazy">
      <p class="text-xs text-slate-500">#${String(p.id).padStart(3, "0")}</p>
      <h2 class="mb-2 text-lg font-semibold capitalize">${p.name}</h2>
      <p class="mb-3 flex flex-wrap gap-1">${chips}</p>
      <p class="mb-1 text-sm text-slate-500">HP ${p.hp}</p>
      <progress class="h-2 w-full accent-emerald-500" max="200" value="${p.hp}"></progress>
    </article>`;
}
function pintar(items) {
    lista.innerHTML = items.map(tarjeta).join("");
}
// Carga los primeros N pokémon desde la API.
async function cargarPokemones(cantidad) {
    mostrarEstado("Cargando…");
    // try/catch: si algo falla dentro del try (sin internet, API caída...),
    // el código salta al catch en lugar de romper la página.
    try {
        // Petición 1: la lista (solo nombres y urls)
        const { results } = await getJSON(`${BASE_URL}/pokemon?limit=${cantidad}`);
        // Petición 2: el detalle de cada pokémon, TODAS A LA VEZ.
        // results.map(...) crea una promesa por pokémon; Promise.all espera a que terminen todas.
        // (Con un await por pokémon, dentro de un for, tardaría mucho más: se sumarían los tiempos.)
        const detalles = await Promise.all(results.map((r) => getJSON(r.url)));
        pintar(detalles.map(aPokemon)); // API -> Pokemon -> tarjetas
        mostrarEstado(`Mostrando ${detalles.length} pokémon desde la API`);
    }
    catch (error) {
        console.error(error); // el detalle técnico queda en la consola (F12)
        mostrarEstado("No se pudo cargar. Revisa tu conexión e intenta de nuevo.", true);
    }
}
// ARRANQUE: pedimos 6 pokémon.
cargarPokemones(251);
