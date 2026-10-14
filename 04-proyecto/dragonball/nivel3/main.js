"use strict";
// 2) DATOS EN MEMORIA: los 5 personajes del JSON real
const personajes = [
    { id: 1, name: "Goku", image: "https://dragonball-api.com/characters/goku_normal.webp",
        race: "Saiyan", affiliation: "Z Fighter", kiTexto: "60.000.000", kiNumero: 60000000 },
    { id: 2, name: "Vegeta", image: "https://dragonball-api.com/characters/vegeta_normal.webp",
        race: "Saiyan", affiliation: "Z Fighter", kiTexto: "54.000.000", kiNumero: 54000000 },
    { id: 3, name: "Piccolo", image: "https://dragonball-api.com/characters/picolo_normal.webp",
        race: "Namekian", affiliation: "Z Fighter", kiTexto: "2.000.000", kiNumero: 2000000 },
    { id: 4, name: "Bulma", image: "https://dragonball-api.com/characters/bulma.webp",
        race: "Human", affiliation: "Z Fighter", kiTexto: "0", kiNumero: 0 },
    { id: 32, name: "Majin Buu", image: "https://dragonball-api.com/characters/BuuGordo_Universo7.webp",
        race: "Majin", affiliation: "Villain", kiTexto: "8 Billion", kiNumero: null },
];
// 3) REFERENCIAS AL DOM: los elementos del HTML que vamos a llenar
const lista = document.querySelector("#lista");
const estado = document.querySelector("#estado");
// Ki más alto de la lista: sirve de "100 %" para la barra (null cuenta como 0)
const maxKi = Math.max(...personajes.map((p) => p.kiNumero ?? 0));
// Decisión B: barra solo si el ki es número; si es null, nada
function barraKi(p) {
    if (p.kiNumero === null)
        return "";
    const porcentaje = Math.round((p.kiNumero / maxKi) * 100);
    return `<progress max="100" value="${porcentaje}">${porcentaje}%</progress>`;
}
// 4) tarjeta(): recibe UN personaje y devuelve el HTML de su tarjeta (texto)
function tarjeta(p) {
    return `
    <article>
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.race}</p>
      <p>Ki: ${p.kiTexto}</p>
      ${barraKi(p)}
    </article>`;
}
// 5) pintar(): convierte TODOS los personajes en tarjetas y los mete en la página
function pintar(items) {
    lista.innerHTML = items.map(tarjeta).join("");
}
// 6) ARRANQUE
pintar(personajes);
estado.textContent = `Mostrando ${personajes.length} personajes (datos en memoria)`;
