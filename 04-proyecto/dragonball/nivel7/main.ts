// Nivel 7: buscador, filtros y detalle.
// Decisión: pido los 58 personajes en UNA sola petición (?limit=100) y filtro en el cliente.
// Así el buscador encuentra a cualquiera (no solo a los 12 primeros) y no hago una petición por cada tecla.

// MODELO: lo que usa MI tarjeta
interface Personaje {
  id: number;
  name: string;
  image: string;
  race: string;
  affiliation: string;
  kiTexto: string;
  kiNumero: number | null;
}

// Así viene UN personaje en la lista de la API (Parte A, JSON real)
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

// Así viene la LISTA (/characters?limit=...): los personajes están en "items"
interface ListaApi {
  items: PersonajeApi[];
  meta: { totalItems: number; itemCount: number; itemsPerPage: number;
          totalPages: number; currentPage: number };
  links: { first: string; previous: string; next: string; last: string };
}

// NUEVO: el detalle (/characters/{id}) trae además el planeta de origen y las transformaciones
interface PlanetaApi {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image: string;
  deletedAt: string | null;
}

interface TransformacionApi {
  id: number;
  name: string;
  image: string;
  ki: string;
  deletedAt: string | null;
}

interface PersonajeDetalleApi extends PersonajeApi {
  originPlanet: PlanetaApi;
  transformations: TransformacionApi[];
}

const BASE_URL = "https://dragonball-api.com/api";
const POR_PAGINA = 12; // cuántas tarjetas muestra cada "Ver más"

// Elementos de la página
const lista = document.querySelector<HTMLElement>("#lista")!;
const estado = document.querySelector<HTMLElement>("#estado")!;
const buscador = document.querySelector<HTMLInputElement>("#buscador")!;
const selectAfiliacion = document.querySelector<HTMLSelectElement>("#afiliacion")!;
const botonesRaza = document.querySelectorAll<HTMLButtonElement>("[data-raza]");
const botonVerMas = document.querySelector<HTMLButtonElement>("#ver-mas")!;
const dialogo = document.querySelector<HTMLDialogElement>("#detalle")!;
const contenidoDetalle = document.querySelector<HTMLElement>("#detalle-contenido")!;
const botonCerrar = document.querySelector<HTMLButtonElement>("#cerrar-detalle")!;

// ESTADO de la página: todos los personajes y los filtros elegidos
let todos: Personaje[] = [];
let razaActiva = "";          // "" significa "Todos"
let visibles = POR_PAGINA;    // cuántas tarjetas se ven ahora

// Mensajes para el usuario. Si esError es true, Tailwind lo pinta en Rojo Estrella
function mostrarEstado(texto: string, esError = false): void {
  estado.textContent = texto;
  estado.classList.toggle("text-estrella", esError);
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
  return `<progress class="mt-3 h-3 w-full appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-saiyan/40 [&::-webkit-progress-value]:bg-ki" max="100" value="${porcentaje}">${porcentaje}%</progress>`;
}

// Record<string, string> = un diccionario: la clave es la raza y el valor, sus clases de Tailwind
const COLORES_RAZA: Record<string, string> = {
  Saiyan: "bg-gi text-saiyan",
  Namekian: "bg-ki text-saiyan",
  Human: "bg-guante text-cinturon",
  Android: "bg-estrella text-guante",
  "Frieza Race": "bg-saiyan text-ki",
};
// Si llega una raza que no está en el diccionario (ej. "Majin"), usamos este color neutro
const COLOR_RAZA_POR_DEFECTO = "bg-saiyan/60 text-guante";

// Devuelve la etiqueta de la raza con su color
function chipRaza(raza: string): string {
  const clases = COLORES_RAZA[raza] ?? COLOR_RAZA_POR_DEFECTO;
  return `<span class="mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-bold ${clases}">${raza}</span>`;
}

// La tarjeta guarda el id en data-id: al hacer clic sabemos qué personaje abrir
function tarjeta(p: Personaje): string {
  return `
    <article data-id="${p.id}" class="cursor-pointer rounded-2xl bg-cinturon p-3 text-center sm:p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-gi/50">
      <img src="${p.image}" alt="Imagen de ${p.name}" loading="lazy" width="200" height="200"
        class="mx-auto h-36 w-full object-contain sm:h-48">
      <h3 class="mt-3 text-lg font-extrabold sm:text-xl">${p.name}</h3>
      ${chipRaza(p.race)}
      <p>Ki: ${p.kiTexto}</p>
      ${barraKi(p)}
      <button type="button" class="mt-3 rounded-full bg-gi px-4 py-1 text-sm font-bold text-saiyan hover:bg-ki">Ver detalle</button>
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

// Si una imagen falla, la cambiamos por la esfera y avisamos en el alt.
// Ahora recibe el contenedor: sirve para la lista y también para el detalle
function activarRespaldo(contenedor: HTMLElement): void {
  contenedor.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.src = IMAGEN_RESPALDO;
      img.alt = `${img.alt} (no disponible)`;
    }, { once: true });
  });
}

function pintar(items: Personaje[]): void {
  lista.innerHTML = items.map(tarjeta).join("");
  activarRespaldo(lista); // después de crear las tarjetas, vigilamos sus imágenes
}

// FILTROS: se cumplen los tres a la vez (nombre Y raza Y afiliación)
function filtrar(): Personaje[] {
  const texto = buscador.value.trim().toLowerCase();
  const afiliacion = selectAfiliacion.value;
  return todos.filter((p) =>
    p.name.toLowerCase().includes(texto) &&
    (razaActiva === "" || p.race === razaActiva) &&
    (afiliacion === "" || p.affiliation === afiliacion)
  );
}

// Vuelve a pintar según los filtros. Incluye el estado "sin resultados"
function actualizar(): void {
  const resultado = filtrar();
  if (resultado.length === 0) {
    lista.innerHTML = "";
    mostrarEstado("No encontramos guerreros con esos filtros. Prueba con otro nombre o raza.");
    botonVerMas.classList.add("hidden");
    return;
  }
  pintar(resultado.slice(0, visibles));
  mostrarEstado(`Mostrando ${Math.min(visibles, resultado.length)} de ${resultado.length} personajes`);
  botonVerMas.classList.toggle("hidden", visibles >= resultado.length);
}

// Cada vez que cambia un filtro, volvemos a la primera "página"
function alCambiarFiltro(): void {
  visibles = POR_PAGINA;
  actualizar();
}

// DETALLE: la vista con los datos extra que solo trae /characters/{id}
function vistaDetalle(d: PersonajeDetalleApi): string {
  const planeta = d.originPlanet.isDestroyed
    ? `${d.originPlanet.name} (destruido)`
    : d.originPlanet.name;
  const transformaciones = d.transformations.length === 0 ? "" : `
    <div class="px-6 pb-6">
      <h3 class="text-lg font-bold text-ki">Transformaciones</h3>
      <ul class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
        ${d.transformations.map((t) => `
          <li class="rounded-xl bg-saiyan/40 p-2 text-center text-sm">
            <img src="${t.image}" alt="${t.name}" loading="lazy" class="mx-auto h-24 object-contain">
            <span class="block font-bold">${t.name}</span>
            <span>Ki: ${t.ki}</span>
          </li>`).join("")}
      </ul>
    </div>`;
  return `
    <div class="grid gap-6 p-6 md:grid-cols-[1fr_2fr]">
      <img src="${d.image}" alt="Imagen de ${d.name}" class="mx-auto h-72 object-contain">
      <div class="space-y-2">
        <h2 class="text-3xl font-extrabold">${d.name}</h2>
        ${chipRaza(d.race)}
        <p><span class="font-bold text-ki">Ki:</span> ${d.ki} · <span class="font-bold text-ki">Ki máximo:</span> ${d.maxKi}</p>
        <p><span class="font-bold text-ki">Género:</span> ${d.gender} · <span class="font-bold text-ki">Afiliación:</span> ${d.affiliation}</p>
        <p><span class="font-bold text-ki">Planeta de origen:</span> ${planeta}</p>
        <p class="text-sm leading-relaxed">${d.description}</p>
      </div>
    </div>
    ${transformaciones}`;
}

// Abre el diálogo y pide el detalle a la API (con estados de carga y error)
async function abrirDetalle(id: number): Promise<void> {
  contenidoDetalle.innerHTML = `<p class="p-6 text-center">Cargando guerrero…</p>`;
  dialogo.showModal();
  try {
    const detalle = await getJSON<PersonajeDetalleApi>(`${BASE_URL}/characters/${id}`);
    contenidoDetalle.innerHTML = vistaDetalle(detalle);
    activarRespaldo(contenidoDetalle);
  } catch (error) {
    console.error(error);
    contenidoDetalle.innerHTML = `<p class="p-6 text-center text-estrella">No pudimos cargar este guerrero. Intenta de nuevo.</p>`;
  }
}

// EVENTOS
buscador.addEventListener("input", alCambiarFiltro);
selectAfiliacion.addEventListener("change", alCambiarFiltro);

botonesRaza.forEach((boton) => {
  boton.addEventListener("click", () => {
    razaActiva = boton.dataset.raza ?? "";
    // Solo el botón elegido queda con aria-pressed="true" (Tailwind lo pinta de amarillo)
    botonesRaza.forEach((b) => b.setAttribute("aria-pressed", String(b === boton)));
    alCambiarFiltro();
  });
});

botonVerMas.addEventListener("click", () => {
  visibles += POR_PAGINA;
  actualizar();
});

// Un solo listener para todas las tarjetas (delegación de eventos)
lista.addEventListener("click", (evento) => {
  const tarjetaElegida = (evento.target as HTMLElement).closest<HTMLElement>("[data-id]");
  if (tarjetaElegida) abrirDetalle(Number(tarjetaElegida.dataset.id));
});

botonCerrar.addEventListener("click", () => dialogo.close());
// Clic en el fondo oscuro (fuera del contenido) también cierra
dialogo.addEventListener("click", (evento) => {
  if (evento.target === dialogo) dialogo.close();
});

// Pide TODOS los personajes una sola vez
async function cargarPersonajes(): Promise<void> {
  mostrarEstado("Cargando personajes…");
  try {
    const { items } = await getJSON<ListaApi>(`${BASE_URL}/characters?limit=100`);
    todos = items.map(aPersonaje);                                 // API → Personaje
    maxKi = Math.max(1, ...todos.map((p) => p.kiNumero ?? 0));
    actualizar();                                                  // Personaje → tarjetas
  } catch (error) {
    console.error(error); // el detalle técnico queda en la consola (F12)
    mostrarEstado("¡Oh no! No pudimos reunir las esferas. Revisa tu conexión e intenta de nuevo.", true);
  }
}

// ARRANQUE
cargarPersonajes();
