"use strict";
// ============================================================
// PASO 3 · Datos en memoria
// Los pokémon viven como DATOS (un arreglo de objetos) y una función
// los convierte en HTML. Para agregar un pokémon basta una línea de datos.
// ============================================================
// 2) DATOS EN MEMORIA: es un arreglo de objetos (se parece mucho a un JSON).
//    Más adelante este mismo arreglo vendrá de internet.
const pokemones = [
    { id: 1, name: "bulbasaur", types: ["grass", "poison"], hp: 45 },
    { id: 2, name: "ivysaur", types: ["grass", "poison"], hp: 60 },
    { id: 3, name: "venusaur", types: ["grass", "poison"], hp: 80 },
    { id: 4, name: "charmander", types: ["fire"], hp: 39 },
    { id: 5, name: "charmeleon", types: ["fire"], hp: 58 },
    { id: 6, name: "charizard", types: ["fire", "flying"], hp: 78 },
    { id: 7, name: "pepe", types: ["water", "fire"], hp: 44 },
];
// 3) REFERENCIAS AL DOM: buscamos en la página los elementos que vamos a usar.
//    querySelector puede devolver null si no existe; el "!" le dice a TypeScript
//    "confía en mí, sí existe". <HTMLElement> le indica qué tipo de elemento es.
const lista = document.querySelector("#lista");
const estado = document.querySelector("#estado");
// 4) tarjeta(): recibe UN pokémon y devuelve el HTML de su tarjeta como texto.
//    Es el mismo HTML que escribimos a mano en el paso 1, pero con ${...}
//    para insertar los valores. Eso se llama "template string" (comillas invertidas).
function tarjeta(p) {
    // map() transforma cada tipo en un <span>; join("") los une en un solo texto
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
// 5) pintar(): convierte TODOS los pokémon en tarjetas y las mete en la página.
function pintar(items) {
    lista.innerHTML = items.map(tarjeta).join(""); // una tarjeta por pokémon
}
// 6) ARRANQUE: dibujamos la lista y mostramos un mensaje.
pintar(pokemones);
estado.textContent = `Mostrando ${pokemones.length} pokémon (datos en memoria)`;
