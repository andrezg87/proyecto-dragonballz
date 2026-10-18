// Nivel 4: aquí acomodas tu código TypeScript, pieza por pieza.
// Cuando quieras probarlo:  npm run build   (genera main.js, que es el que carga el navegador)

// MODELO: lo que usa MI tarjeta (igual que en el nivel 3)
interface Personaje {
  id: number;
  name: string;
  image: string;
  race: string;
  affiliation: string;
  kiTexto: string;
  kiNumero: number | null;
}

// NUEVO: así viene UN personaje de la API (Parte A, JSON real)
interface PersonajeApi {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  deletedAt: string | null;
}

// NUEVO: así viene la LISTA (/characters?limit=...): los personajes están en "items"
interface ListaApi {
  items: PersonajeApi[];
  meta: { totalItems: number; itemCount: number; itemsPerPage: number;
          totalPages: number; currentPage: number };
  links: { first: string; previous: string; next: string; last: string };
}

const BASE_URL = "https://dragonball-api.com/api";

const lista = document.querySelector<HTMLElement>("#lista")!;
const estado = document.querySelector<HTMLElement>("#estado")!;

// Mensajes para el usuario. Si esError es true, el CSS lo pinta en rojo
function mostrarEstado(texto: string, esError = false): void {
  estado.textContent = texto;
  estado.classList.toggle("error", esError);
}

// UNA petición a la API y devuelve el JSON ya convertido (igual que en la Pokédex)
async function getJSON<T>(url: string): Promise<T> {
  const respuesta = await fetch(url);
  // fetch NO lanza error con 404 o 400: lo revisamos nosotros
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status} al pedir ${url}`);
  }
  return respuesta.json();
}

// Decisión B: "60.000.000" → 60000000 · "280,000,000" → 280000000
//             "8 Billion" o "unknown" → null (no se puede convertir)
function convertirKi(texto: string): number | null {
  const limpio = texto.trim().replace(/[.,]/g, ""); // quita espacios, puntos y comas
  if (!/^\d+$/.test(limpio)) return null;           // ¿quedaron solo dígitos?
  return Number(limpio);
}

// ADAPTADOR: convierte la forma de la API (PersonajeApi) en la de mi tarjeta (Personaje)
function aPersonaje(api: PersonajeApi): Personaje {
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

function barraKi(p: Personaje): string {
  if (p.kiNumero === null) return "";
  const porcentaje = Math.round((p.kiNumero / maxKi) * 100);
  return `<progress max="100" value="${porcentaje}">${porcentaje}%</progress>`;
}

// Igual que en el nivel 3: NO cambian gracias al adaptador
function tarjeta(p: Personaje): string {
  return `
    <article>
      <img src="${p.image}" alt="Imagen de ${p.name}" loading="lazy" width="200" height="200">
      <h3>${p.name}</h3>
      <p>${p.race}</p>
      <p>Ki: ${p.kiTexto}</p>
      ${barraKi(p)}
    </article>`;
}

// Plan B: una esfera del dragón dibujada en SVG (no depende de internet)
const IMAGEN_RESPALDO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
       <circle cx="50" cy="50" r="45" fill="#F58A1F"/>
       <text x="50" y="64" font-size="40" text-anchor="middle" fill="#D7263D">★</text>
     </svg>`
  );

// Si una imagen falla, la cambiamos por la esfera y avisamos en el alt
function activarRespaldo(): void {
  lista.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.src = IMAGEN_RESPALDO;
      img.alt = `${img.alt} (no disponible)`;
    }, { once: true });
  });
}

function pintar(items: Personaje[]): void {
  lista.innerHTML = items.map(tarjeta).join("");
  activarRespaldo(); // después de crear las tarjetas, vigilamos sus imágenes
}


// NUEVO: pide los personajes a la API. UNA sola petición (la lista ya trae todo)
async function cargarPersonajes(cantidad: number): Promise<void> {
  mostrarEstado("Cargando personajes…");
  try {
    const { items } = await getJSON<ListaApi>(`${BASE_URL}/characters?limit=${cantidad}`);
    const personajes = items.map(aPersonaje);                  // API → Personaje
    maxKi = Math.max(1, ...personajes.map((p) => p.kiNumero ?? 0));
    pintar(personajes);                                        // Personaje → tarjetas
    mostrarEstado(`Mostrando ${personajes.length} personajes desde la API`);
  } catch (error) {
    console.error(error); // el detalle técnico queda en la consola (F12)
    mostrarEstado("¡Oh no! No pudimos reunir las esferas. Revisa tu conexión e intenta de nuevo.", true);
  }
}

// ARRANQUE
cargarPersonajes(12);


