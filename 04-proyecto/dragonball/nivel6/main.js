"use strict";
// Nivel 4: aquí acomodas tu código TypeScript, pieza por pieza.
// Cuando quieras probarlo:  npm run build   (genera main.js, que es el que carga el navegador)
const BASE_URL = "https://dragonball-api.com/api";
const lista = document.querySelector("#lista");
const estado = document.querySelector("#estado");
// Mensajes para el usuario. Si esError es true, el CSS lo pinta en rojo
function mostrarEstado(texto, esError = false) {
    estado.textContent = texto;
    estado.classList.toggle("text-estrella", esError);
}
// UNA petición a la API y devuelve el JSON ya convertido (igual que en la Pokédex)
async function getJSON(url) {
    const respuesta = await fetch(url);
    // fetch NO lanza error con 404 o 400: lo revisamos nosotros
    if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status} al pedir ${url}`);
    }
    return respuesta.json();
}
// Decisión B: "60.000.000" → 60000000 · "280,000,000" → 280000000
//             "8 Billion" o "unknown" → null (no se puede convertir)
function convertirKi(texto) {
    const limpio = texto.trim().replace(/[.,]/g, ""); // quita espacios, puntos y comas
    if (!/^\d+$/.test(limpio))
        return null; // ¿quedaron solo dígitos?
    return Number(limpio);
}
// ADAPTADOR: convierte la forma de la API (PersonajeApi) en la de mi tarjeta (Personaje)
function aPersonaje(api) {
    return {
        id: api.id,
        name: api.name,
        image: api.image,
        race: api.race,
        affiliation: api.affiliation,
        kiTexto: api.ki,
        kiNumero: convertirKi(api.ki),
    };
}
// Ki más alto de lo que llegó: es el "100 %" de la barra (se calcula al cargar)
let maxKi = 1;
function barraKi(p) {
    if (p.kiNumero === null)
        return "";
    const porcentaje = Math.round((p.kiNumero / maxKi) * 100);
    return `<progress class="mt-3 h-3 w-full appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-saiyan/40 [&::-webkit-progress-value]:bg-ki" max="100" value="${porcentaje}">${porcentaje}%</progress>`;
}
// Record<string, string> = un diccionario: la clave es la raza y el valor, sus clases de Tailwind
const COLORES_RAZA = {
    Saiyan: "bg-gi text-saiyan",
    Namekian: "bg-ki text-saiyan",
    Human: "bg-guante text-cinturon",
    Android: "bg-estrella text-guante",
    "Frieza Race": "bg-saiyan text-ki",
};
// Si llega una raza que no está en el diccionario (ej. "Majin"), usamos este color neutro
const COLOR_RAZA_POR_DEFECTO = "bg-saiyan/60 text-guante";
// Devuelve la etiqueta de la raza con su color
function chipRaza(raza) {
    const clases = COLORES_RAZA[raza] ?? COLOR_RAZA_POR_DEFECTO;
    return `<span class="mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-bold ${clases}">${raza}</span>`;
}
// Igual que en el nivel 3, pero ahora con clases de Tailwind en vez de styles.css
function tarjeta(p) {
    return `
    <article class="rounded-2xl bg-cinturon p-4 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-gi/50">
      <img src="${p.image}" alt="Imagen de ${p.name}" loading="lazy" width="200" height="200"
        class="mx-auto h-48 w-full object-contain">
      <h3 class="mt-3 text-xl font-extrabold">${p.name}</h3>
            ${chipRaza(p.race)}
      <p>Ki: ${p.kiTexto}</p>
      ${barraKi(p)}
    </article>`;
}
// Plan B: una esfera del dragón dibujada en SVG (no depende de internet)
const IMAGEN_RESPALDO = "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
       <circle cx="50" cy="50" r="45" fill="#F58A1F"/>
       <text x="50" y="64" font-size="40" text-anchor="middle" fill="#D7263D">★</text>
     </svg>`);
// Si una imagen falla, la cambiamos por la esfera y avisamos en el alt
function activarRespaldo() {
    lista.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            img.src = IMAGEN_RESPALDO;
            img.alt = `${img.alt} (no disponible)`;
        }, { once: true });
    });
}
function pintar(items) {
    lista.innerHTML = items.map(tarjeta).join("");
    activarRespaldo(); // después de crear las tarjetas, vigilamos sus imágenes
}
// NUEVO: pide los personajes a la API. UNA sola petición (la lista ya trae todo)
async function cargarPersonajes(cantidad) {
    mostrarEstado("Cargando personajes…");
    try {
        const { items } = await getJSON(`${BASE_URL}/characters?limit=${cantidad}`);
        const personajes = items.map(aPersonaje); // API → Personaje
        maxKi = Math.max(1, ...personajes.map((p) => p.kiNumero ?? 0));
        pintar(personajes); // Personaje → tarjetas
        mostrarEstado(`Mostrando ${personajes.length} personajes desde la API`);
    }
    catch (error) {
        console.error(error); // el detalle técnico queda en la consola (F12)
        mostrarEstado("¡Oh no! No pudimos reunir las esferas. Revisa tu conexión e intenta de nuevo.", true);
    }
}
// ARRANQUE
cargarPersonajes(12);
