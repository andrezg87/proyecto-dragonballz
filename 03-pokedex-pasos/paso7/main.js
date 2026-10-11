"use strict";
// ============================================================
// PASO 7 · El remate
// Partimos del paso 6 (API + imágenes + Tailwind) y agregamos:
//   1. Los 251 pokémon, cargados por lotes con barra de progreso
//   2. Un buscador por nombre/número y un filtro por tipo
//   3. Un carrusel de imágenes dentro de cada tarjeta
//   4. Un carrusel automático de legendarios
//   5. Una ventana de detalle con estadísticas
//   6. Animaciones al pasar el mouse
// ============================================================
// ---------- 2) CONSTANTES ----------
const BASE_URL = "https://pokeapi.co/api/v2";
const TOTAL = 251; // Kanto (1-151) + Johto (152-251)
const LOTE = 25; // cuántos pokémon pedimos a la vez
const POR_PAGINA = 24; // cuántas tarjetas mostramos antes de "Mostrar más"
// Los legendarios del carrusel automático (por número de pokédex).
const LEGENDARIOS = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251];
// Un color por tipo (en hexadecimal). Record<string, string> = diccionario de texto a texto.
const COLOR_TIPO = {
    normal: "#a8a77a", fire: "#ee8130", water: "#6390f0", electric: "#f7d02c",
    grass: "#7ac74c", ice: "#96d9d6", fighting: "#c22e28", poison: "#a33ea1",
    ground: "#e2bf65", flying: "#a98ff3", psychic: "#f95587", bug: "#a6b91a",
    rock: "#b6a136", ghost: "#735797", dragon: "#6f35fc", dark: "#705746",
    steel: "#b7b7ce", fairy: "#d685ad",
};
const TIPOS = Object.keys(COLOR_TIPO); // ["normal", "fire", ...] para dibujar los filtros
const TIPOS_CLAROS = new Set(["electric", "ice", "ground", "steel"]); // fondo claro = texto oscuro
const NOMBRE_STAT = {
    hp: "HP", attack: "Ataque", defense: "Defensa",
    "special-attack": "At. especial", "special-defense": "Def. especial", speed: "Velocidad",
};
// Si un tipo no está en el diccionario usamos gris. Operador ?? = "si es undefined, usa esto".
const colorDe = (tipo) => COLOR_TIPO[tipo] ?? "#94a3b8";
// ---------- 3) ELEMENTOS DE LA PÁGINA ----------
// El "!" le dice a TypeScript: "este elemento seguro existe en el HTML".
const lista = document.querySelector("#lista");
const destacados = document.querySelector("#destacados");
const filtros = document.querySelector("#filtros");
const estado = document.querySelector("#estado");
const progreso = document.querySelector("#progreso");
const progresoCaja = document.querySelector("#progreso-caja");
const vacio = document.querySelector("#vacio");
const botonMas = document.querySelector("#mas");
const reintentar = document.querySelector("#reintentar");
const buscador = document.querySelector("#buscar");
const detalle = document.querySelector("#detalle");
// ---------- 4) ESTADO DE LA APLICACIÓN ----------
// Son las "variables que cambian". Cada vez que cambian, volvemos a dibujar (render).
let todos = []; // todos los pokémon cargados hasta ahora
let busqueda = ""; // lo que escribió el usuario
let tipoActivo = "todos"; // filtro de tipo seleccionado
let mostrar = POR_PAGINA; // cuántas tarjetas se ven
let cargando = true;
const yaAnimados = new Set(); // ids que ya hicieron su animación de entrada
// ---------- 5) API ----------
async function getJSON(url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok)
        throw new Error(`HTTP ${respuesta.status} al pedir ${url}`);
    return respuesta.json();
}
// Adaptador: de la forma de la API a la forma de nuestra tarjeta.
function aPokemon(api) {
    const s = api.sprites;
    // Lista de candidatas: [etiqueta, url]. Algunas serán null (ese pokémon no tiene esa imagen).
    const candidatas = [
        ["Arte oficial", s.other["official-artwork"].front_default],
        ["Arte brillante", s.other["official-artwork"].front_shiny],
        ["Animado", s.other.showdown.front_default],
        ["Home", s.other.home.front_default],
        ["Home brillante", s.other.home.front_shiny],
        ["Dream World", s.other.dream_world.front_default],
        ["Sprite frente", s.front_default],
        ["Sprite espalda", s.back_default],
        ["Sprite brillante", s.front_shiny],
    ];
    // filter con "type guard": (c): c is [string, string] le dice a TypeScript que,
    // después del filtro, la url YA NO puede ser null. Luego map las convierte en objetos Imagen.
    const imagenes = candidatas
        .filter((c) => c[1] !== null)
        .map(([etiqueta, url]) => ({ etiqueta, url }));
    const stats = api.stats.map((x) => ({
        nombre: NOMBRE_STAT[x.stat.name] ?? x.stat.name,
        valor: x.base_stat,
    }));
    return {
        id: api.id,
        name: api.name,
        types: api.types.map((t) => t.type.name),
        hp: api.stats.find((x) => x.stat.name === "hp")?.base_stat ?? 0,
        altura: api.height / 10, // la API da decímetros
        peso: api.weight / 10, // la API da hectogramos
        habilidades: api.abilities.map((a) => a.ability.name.replace(/-/g, " ")),
        stats,
        imagenes,
    };
}
// Carga los 251 en LOTES de 25. Cada lote se pide en paralelo (Promise.all) y,
// apenas llega, avisamos con una función (callback) para dibujar y mover la barra.
// Así el usuario ve tarjetas en segundos, sin esperar a que lleguen las 251.
async function cargarTodos(alLlegarLote) {
    const { results } = await getJSON(`${BASE_URL}/pokemon?limit=${TOTAL}`);
    for (let i = 0; i < results.length; i += LOTE) {
        const lote = results.slice(i, i + LOTE); // un pedazo de la lista
        const detalles = await Promise.all(lote.map((r) => getJSON(r.url)));
        todos = todos.concat(detalles.map(aPokemon));
        alLlegarLote(todos.length);
    }
}
// ---------- 6) PIEZAS DE HTML (cada función devuelve un texto HTML) ----------
// Chip de tipo con el color del tipo.
function chip(tipo) {
    const texto = TIPOS_CLAROS.has(tipo) ? "text-slate-900" : "text-white";
    return `<span class="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${texto}" style="background:${colorDe(tipo)}">${tipo}</span>`;
}
// EL CARRUSEL. Es solo una fila horizontal (flex) con scroll y "snap":
//   - snap-x snap-mandatory: al deslizar, cada imagen se acomoda sola
//   - cada <img> mide w-full (el ancho completo), así se ve UNA a la vez
// Los botones, los puntitos y la etiqueta se actualizan con JavaScript (ver sección 8).
function carrusel(p, alto) {
    const slides = p.imagenes
        .map((img) => `<img src="${img.url}" alt="${p.name}: ${img.etiqueta}" data-etiqueta="${img.etiqueta}" loading="lazy"
        class="${alto} w-full shrink-0 snap-center object-contain p-3 drop-shadow-xl transition duration-300 group-hover:scale-110">`)
        .join("");
    const puntos = p.imagenes
        .map((_, i) => `<span class="punto h-1.5 rounded-full transition-all ${i === 0 ? "w-4 bg-white" : "w-1.5 bg-white/50"}"></span>`)
        .join("");
    // group/car: permite que los botones aparezcan solo al pasar el mouse sobre ESTE carrusel
    const botonBase = "absolute top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-lg text-white opacity-0 backdrop-blur transition hover:bg-black/70 group-hover/car:opacity-100 focus-visible:opacity-100";
    return `
    <div class="group/car relative">
      <div class="carrusel flex snap-x snap-mandatory overflow-x-auto" data-carrusel>${slides}</div>
      <button type="button" data-dir="-1" aria-label="Imagen anterior" class="${botonBase} left-2">‹</button>
      <button type="button" data-dir="1" aria-label="Imagen siguiente" class="${botonBase} right-2">›</button>
      <div class="pointer-events-none absolute inset-x-0 bottom-1.5 flex items-center justify-center gap-1" data-puntos>${puntos}</div>
      <span data-nombre-imagen class="pointer-events-none absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">${p.imagenes[0]?.etiqueta ?? ""}</span>
    </div>`;
}
// La tarjeta completa.
function tarjeta(p, indice) {
    const [c1, c2 = c1] = p.types.map(colorDe); // destructuring con valor por defecto
    const animar = yaAnimados.has(p.id) ? "" : "animate-aparecer"; // solo animamos las tarjetas NUEVAS
    const retraso = (indice % POR_PAGINA) * 40; // cada tarjeta entra un poco después de la anterior
    // Qué pasa al pasar el mouse (hover:) — todo es CSS, sin JavaScript:
    //   hover:-translate-y-2   la tarjeta sube
    //   .tarjeta:hover          el resplandor del color del tipo (regla en el <style> del HTML)
    //   group-hover:scale-110   la imagen crece (viene de carrusel())
    //   group-hover:animate-flotar   el contenedor de la imagen "flota"
    return `
    <article data-id="${p.id}" style="--glow:${c1}aa; animation-delay:${retraso}ms"
      class="tarjeta group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition duration-300 hover:-translate-y-2 hover:border-slate-600 ${animar}">
      <div style="background:linear-gradient(135deg, ${c1}, ${c2})" class="group-hover:animate-flotar">
        ${carrusel(p, "h-44")}
      </div>
      <button type="button" data-abrir class="block w-full p-4 text-left">
        <p class="text-xs font-semibold text-slate-500">#${String(p.id).padStart(3, "0")}</p>
        <h2 class="mb-2 text-lg font-bold capitalize">${p.name}</h2>
        <p class="mb-3 flex flex-wrap gap-1.5">${p.types.map(chip).join("")}</p>
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <span>HP ${p.hp}</span>
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div class="h-full rounded-full bg-emerald-400" style="width:${Math.min(100, (p.hp / 200) * 100)}%"></div>
          </div>
        </div>
      </button>
    </article>`;
}
// Contenido de la ventana de detalle (modal).
function detalleHtml(p) {
    const [c1, c2 = c1] = p.types.map(colorDe);
    const barras = p.stats
        .map((s) => `
      <div class="grid grid-cols-[6.5rem_2.5rem_1fr] items-center gap-2 text-sm">
        <span class="text-slate-400">${s.nombre}</span>
        <span class="font-semibold tabular-nums">${s.valor}</span>
        <div class="h-2 overflow-hidden rounded-full bg-slate-800">
          <div class="h-full rounded-full" style="width:${Math.min(100, (s.valor / 160) * 100)}%; background:${c1}"></div>
        </div>
      </div>`)
        .join("");
    return `
    <div class="max-h-[92vh] overflow-y-auto">
      <div style="background:linear-gradient(135deg, ${c1}, ${c2})" class="group relative">
        ${carrusel(p, "h-64")}
        <form method="dialog" class="absolute right-3 top-3 z-20">
          <button aria-label="Cerrar" class="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70">✕</button>
        </form>
      </div>
      <div class="space-y-4 p-6">
        <div>
          <p class="text-sm font-semibold text-slate-500">#${String(p.id).padStart(3, "0")}</p>
          <h2 class="text-3xl font-extrabold capitalize">${p.name}</h2>
          <p class="mt-2 flex flex-wrap gap-1.5">${p.types.map(chip).join("")}</p>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center text-sm">
          <div class="rounded-2xl bg-slate-800 p-3"><p class="text-slate-400">Altura</p><p class="text-lg font-bold">${p.altura} m</p></div>
          <div class="rounded-2xl bg-slate-800 p-3"><p class="text-slate-400">Peso</p><p class="text-lg font-bold">${p.peso} kg</p></div>
          <div class="rounded-2xl bg-slate-800 p-3"><p class="text-slate-400">Habilidades</p><p class="text-sm font-bold capitalize">${p.habilidades.join(", ")}</p></div>
        </div>
        <div class="space-y-2">${barras}</div>
      </div>
    </div>`;
}
// Tarjeta grande del carrusel automático de legendarios.
function tarjetaLegendario(p) {
    const [c1, c2 = c1] = p.types.map(colorDe);
    const imagen = p.imagenes[0]?.url ?? "";
    return `
    <button type="button" data-id="${p.id}" data-legendario style="background:linear-gradient(135deg, ${c1}, ${c2})"
      class="group relative h-52 w-[min(80vw,22rem)] shrink-0 snap-center overflow-hidden rounded-3xl p-5 text-left shadow-lg transition duration-300 hover:scale-[1.03]">
      <p class="text-xs font-semibold text-white/70">#${String(p.id).padStart(3, "0")}</p>
      <h3 class="text-2xl font-extrabold capitalize text-white drop-shadow">${p.name}</h3>
      <p class="mt-1 flex gap-1.5">${p.types.map(chip).join("")}</p>
      <img src="${imagen}" alt="${p.name}" loading="lazy"
        class="absolute -bottom-2 -right-2 h-44 w-44 object-contain drop-shadow-2xl transition duration-500 group-hover:-rotate-6 group-hover:scale-110">
    </button>`;
}
// ---------- 7) DIBUJAR (render) ----------
// ¿Qué pokémon pasan el filtro de tipo y la búsqueda?
function filtrados() {
    const q = busqueda.replace(/^#/, "");
    const numero = Number(q);
    return todos.filter((p) => {
        const pasaTipo = tipoActivo === "todos" || p.types.includes(tipoActivo);
        const pasaTexto = q === "" || p.name.includes(q) || (!Number.isNaN(numero) && p.id === numero);
        return pasaTipo && pasaTexto;
    });
}
function mostrarEstado(texto) {
    estado.textContent = texto;
}
function pintarFiltros() {
    const botones = ["todos", ...TIPOS].map((t) => {
        const activo = t === tipoActivo;
        const estilo = activo
            ? t === "todos" ? "background:#f97316;color:#fff" : `background:${colorDe(t)};color:${TIPOS_CLAROS.has(t) ? "#0f172a" : "#fff"}`
            : "";
        const base = activo ? "border-transparent" : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500";
        return `<button type="button" data-tipo="${t}" style="${estilo}" class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition ${base}">${t}</button>`;
    });
    filtros.innerHTML = botones.join("");
}
// render(): toma el ESTADO (todos, busqueda, tipoActivo, mostrar) y lo convierte en HTML.
// Regla de oro: cuando algo cambie, modificamos el estado y llamamos a render().
function render() {
    const coincidencias = filtrados();
    const visibles = coincidencias.slice(0, mostrar);
    lista.innerHTML = visibles.map(tarjeta).join("");
    visibles.forEach((p) => yaAnimados.add(p.id));
    vacio.hidden = cargando || coincidencias.length > 0;
    botonMas.hidden = visibles.length >= coincidencias.length;
    if (!cargando) {
        mostrarEstado(`Mostrando ${visibles.length} de ${coincidencias.length} pokémon`);
    }
}
// Carrusel automático de legendarios (se dibuja cuando ya llegaron todos los datos).
function pintarLegendarios() {
    const elegidos = todos.filter((p) => LEGENDARIOS.includes(p.id));
    destacados.innerHTML = elegidos.map(tarjetaLegendario).join("");
}
// ---------- 8) EVENTOS ----------
// Buscador: cada vez que se escribe, actualizamos el estado y volvemos a dibujar.
buscador.addEventListener("input", () => {
    busqueda = buscador.value.trim().toLowerCase();
    mostrar = POR_PAGINA;
    render();
});
// Atajo de teclado: "/" enfoca el buscador (si no estás escribiendo ya en un campo).
document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== buscador) {
        e.preventDefault();
        buscador.focus();
    }
});
filtros.addEventListener("click", (e) => {
    // closest() sube por el DOM hasta encontrar un elemento con data-tipo
    const boton = e.target.closest("[data-tipo]");
    if (!boton)
        return;
    tipoActivo = boton.dataset.tipo ?? "todos";
    mostrar = POR_PAGINA;
    pintarFiltros();
    render();
});
botonMas.addEventListener("click", () => {
    mostrar += POR_PAGINA;
    render();
});
reintentar.addEventListener("click", () => iniciar());
// DELEGACIÓN DE EVENTOS: en vez de poner un listener en cada botón de cada tarjeta
// (¡serían cientos!), ponemos UNO en el contenedor y averiguamos quién recibió el clic.
function moverCarrusel(contenedor, direccion) {
    const ancho = contenedor.clientWidth;
    const total = contenedor.children.length;
    const actual = Math.round(contenedor.scrollLeft / ancho);
    // Operador % para dar la vuelta: después de la última imagen vuelve a la primera.
    const siguiente = (actual + direccion + total) % total;
    contenedor.scrollTo({ left: siguiente * ancho });
}
function clicEnPagina(e) {
    const destino = e.target;
    // 1) ¿Clic en una flecha del carrusel?
    const flecha = destino.closest("[data-dir]");
    if (flecha) {
        const carr = flecha.parentElement.querySelector("[data-carrusel]");
        moverCarrusel(carr, Number(flecha.dataset.dir));
        return;
    }
    // 2) ¿Clic en el cuerpo de una tarjeta o en un legendario? Abrimos el detalle.
    const abrir = destino.closest("[data-abrir], [data-legendario]");
    if (abrir) {
        const id = Number(abrir.closest("[data-id]")?.dataset.id);
        const p = todos.find((x) => x.id === id);
        if (p)
            abrirDetalle(p);
    }
}
lista.addEventListener("click", clicEnPagina);
destacados.addEventListener("click", clicEnPagina);
detalle.addEventListener("click", clicEnPagina);
// El evento "scroll" NO "burbujea" hacia arriba, pero sí podemos escucharlo en la
// fase de captura (tercer parámetro true). Así un solo listener sirve para todos los carruseles.
// Cuando una imagen cambia, actualizamos los puntitos y la etiqueta.
function alDeslizar(e) {
    const carr = e.target;
    if (!carr.matches?.("[data-carrusel]"))
        return;
    const indice = Math.round(carr.scrollLeft / carr.clientWidth);
    const envoltorio = carr.parentElement;
    envoltorio.querySelectorAll(".punto").forEach((punto, i) => {
        punto.className = `punto h-1.5 rounded-full transition-all ${i === indice ? "w-4 bg-white" : "w-1.5 bg-white/50"}`;
    });
    const etiqueta = envoltorio.querySelector("[data-nombre-imagen]");
    const imagen = carr.children[indice];
    if (etiqueta && imagen)
        etiqueta.textContent = imagen.dataset.etiqueta ?? "";
}
document.addEventListener("scroll", alDeslizar, true);
// Ventana de detalle.
function abrirDetalle(p) {
    detalle.innerHTML = detalleHtml(p);
    detalle.showModal(); // método nativo de <dialog>
}
// Clic en el fondo oscuro (el propio <dialog>, no su contenido) = cerrar.
detalle.addEventListener("click", (e) => {
    if (e.target === detalle)
        detalle.close();
});
// Carrusel automático: cada 3.5 s avanza al siguiente legendario.
// Se pausa con el mouse encima y se desactiva si el usuario pidió "menos movimiento".
let pausado = false;
destacados.addEventListener("mouseenter", () => (pausado = true));
destacados.addEventListener("mouseleave", () => (pausado = false));
const prefiereQuieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefiereQuieto) {
    setInterval(() => {
        if (pausado || destacados.children.length === 0)
            return;
        const ancho = destacados.children[0].clientWidth + 16; // ancho de una tarjeta + el gap
        const alFinal = destacados.scrollLeft + destacados.clientWidth >= destacados.scrollWidth - 8;
        destacados.scrollTo({ left: alFinal ? 0 : destacados.scrollLeft + ancho });
    }, 3500);
}
// ---------- 9) ARRANQUE ----------
// Esqueletos: cuadros grises pulsando mientras llegan los primeros datos.
function pintarEsqueletos() {
    lista.innerHTML = Array.from({ length: 8 }, () => `<div class="h-80 animate-pulse rounded-3xl border border-slate-800 bg-slate-900"></div>`).join("");
}
async function iniciar() {
    cargando = true;
    todos = [];
    reintentar.hidden = true;
    progresoCaja.hidden = false;
    progreso.style.width = "0%";
    mostrarEstado("Cargando pokémon…");
    pintarEsqueletos();
    try {
        await cargarTodos((cargados) => {
            progreso.style.width = `${(cargados / TOTAL) * 100}%`;
            mostrarEstado(`Cargando… ${cargados} de ${TOTAL}`);
            cargando = cargados < TOTAL;
            render(); // dibujamos cada vez que llega un lote
        });
        cargando = false;
        progresoCaja.hidden = true;
        pintarLegendarios();
        render();
    }
    catch (error) {
        console.error(error);
        cargando = false;
        mostrarEstado("No se pudo cargar. Revisa tu conexión e inténtalo de nuevo.");
        reintentar.hidden = false;
        lista.innerHTML = "";
    }
}
pintarFiltros();
iniciar();
