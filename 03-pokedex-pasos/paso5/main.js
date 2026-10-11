"use strict";
// ============================================================
// PASO 5 · Agregamos las imágenes
// La API ya trae la URL de la ilustración de cada pokémon dentro de "sprites".
// Hacemos 3 cosas: pedir ese campo, guardarlo en nuestro modelo y pintarlo con <img>.
// ============================================================
// Dirección base de la API, para no repetirla en cada petición.
const BASE_URL = "https://pokeapi.co/api/v2";
const lista = document.querySelector("#lista");
const estado = document.querySelector("#estado");
// Función para mostrar mensajes. Si esError es true, el CSS lo pinta en rojo.
function mostrarEstado(texto, esError = false) {
    estado.textContent = texto;
    estado.classList.toggle("error", esError);
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
    // NUEVO: probamos la ilustración grande; si no existe, el sprite pequeño; si no, texto vacío.
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
    const chips = p.types.map((t) => `<span class="chip">${t}</span>`).join("");
    // NUEVO: la etiqueta <img>. "alt" describe la imagen (accesibilidad y por si no carga).
    // loading="lazy" hace que el navegador la descargue solo cuando se acerca a la pantalla.
    return `
    <article class="card">
      <img src="${p.imagen}" alt="Ilustración de ${p.name}" loading="lazy">
      <p class="num">#${String(p.id).padStart(3, "0")}</p>
      <h2>${p.name}</h2>
      <p class="tipos">${chips}</p>
      <p class="hp-texto">HP ${p.hp}</p>
      <progress max="200" value="${p.hp}"></progress>
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
