# Curso: JavaScript y TypeScript consumiendo APIs

> **Módulo: Fundamentos de Frontend.** Este repositorio es el proyecto del módulo.

Este repositorio trae **todo lo necesario** para repasar lo visto en clase y hacer el proyecto final. No tienes que buscar nada más: aquí están las guías, el código de ejemplo, el enunciado y las instrucciones paso a paso.

> **¿Primera vez aquí?** Sigue la sección [Empieza en 10 minutos](#empieza-en-10-minutos) y listo.

---

## Qué vas a hacer

1. **Repasar** lo que ya viste en clase (HTML/CSS, JavaScript, `async/await`, `fetch`, TypeScript y la Pokédex).
2. **Aprender Git básico** (tema nuevo, no visto en clase): ramas, commits y subir tu trabajo a GitHub.
3. **Hacer el proyecto Dragon Ball**: explorar una API nueva, diseñar la página, construirla por niveles (una rama de Git por nivel) y analizar tu propio código.
4. **(Bonus)** Publicar tu página en internet con Vercel (+10 %) y trabajar también con los **planetas** de Dragon Ball: diseño, código y despliegue (+15 %).

## Qué hay en cada carpeta

| Carpeta | Qué es | Para qué la usas |
|---|---|---|
| [`00-repaso-rapido/`](00-repaso-rapido/repaso-rapido.html) | **Repaso rápido** de toda la teoría del módulo, en una sola página | Antes de empezar y como chuleta durante el proyecto |
| [`01-clase-html-css/`](01-clase-html-css/) | Guía interactiva de HTML y CSS, más el laboratorio «CSS en movimiento» (`andres.css`) | Repasar la base de la web y ver qué se logra con CSS |
| [`02-clase-js-ts/`](02-clase-js-ts/) | Guía interactiva de JavaScript, `async/await`, `fetch` y TypeScript | Repasar la clase de JavaScript y TypeScript |
| [`03-pokedex-pasos/`](03-pokedex-pasos/) | La Pokédex en 7 pasos, con el código comentado | Ver cómo se construye una app con una API, paso a paso |
| [`04-proyecto/`](04-proyecto/) | **Tu proyecto**: enunciado, wireframe y la carpeta `dragonball/` donde trabajas | El ejercicio |
| [`docs/`](docs/) | Instalación, **Git básico**, uso de la IA y solución de problemas | Cuando algo no funcione o necesites un comando |
| `scripts/` | Pequeños programas que verifican tu ambiente y abren un servidor local | Ya están listos, solo los ejecutas |
| `index.html` | El menú de todo el material | Ábrelo con `npm run servir` |
| `vercel.toml` | Configuración de Vercel, con un comentario en cada línea | La lees en el bonus (nivel 8) |
| `CLAUDE.md` y `.claude/` | La configuración del tutor de Claude Code | No hace falta tocarla |

---

## Empieza en 10 minutos

### Opción A (recomendada): deja que Claude Code te guíe

Si ya tienes Claude Code, no hace falta que descifres una guía de instalación. Abre una terminal, escribe `claude` y pega el prompt de arranque. Tu Claude te guía **paso a paso**: revisa qué tienes instalado, te ayuda con lo que falte, crea tu repositorio contigo, instala las dependencias y verifica que todo funciona, explicándote cada cosa.

👉 El prompt está en [`docs/INSTALACION.md`](docs/INSTALACION.md#camino-a-recomendado-claude-code-te-guía).

Después, dentro de la carpeta del repositorio, usa `claude` con estos comandos: `/preparar-ambiente` (si algo falla), `/repasar-clase`, `/asistir-proyecto` y `/asistir-bonus`.

### Opción B: manual

**Necesitas instalado:**

- **Node.js** (versión 20 o superior) → <https://nodejs.org> (descarga la LTS)
- **Git** → <https://git-scm.com/downloads>
- **Visual Studio Code** → <https://code.visualstudio.com>
- Una cuenta de **GitHub** → <https://github.com> (gratis)

Guía completa para Windows, Mac y Linux: [`docs/INSTALACION.md`](docs/INSTALACION.md#camino-b-guía-manual).

### Paso a paso (opción B)

**1. Consigue tu copia del repositorio.** La forma más fácil: en la página del repositorio (<https://github.com/JevDev2304/curso-js-ts-api>) pulsa **Use this template → Create a new repository**, ponle un nombre, déjalo **Public** y créalo. Así tienes tu propio repositorio. Luego cópialo a tu computador (reemplaza la dirección por la tuya):

```bash
git clone https://github.com/TU-USUARIO/NOMBRE-DE-TU-REPO.git
cd NOMBRE-DE-TU-REPO
```

> ¿No ves el botón *Use this template*? Entonces pulsa **Fork** o simplemente clona el repositorio con `git clone` y pídele ayuda a tu profesor para el paso de subir tu versión.

**2. Abre la carpeta en VS Code.**

```bash
code .
```

**3. Instala las dependencias** (solo una vez; descarga TypeScript):

```bash
npm install
```

**4. Verifica que todo está bien:**

```bash
npm run verificar
```

Debes ver una lista de ✓ y al final **«Todo listo para empezar»**. Si ves ✗, el mensaje te dice exactamente cómo arreglarlo; también puedes mirar [Solución de problemas](docs/SOLUCION-PROBLEMAS.md).

**5. Abre los materiales en el navegador:**

```bash
npm run servir
```

Entra a <http://localhost:5500>. Verás el menú con todo el curso. Para detener el servidor presiona `Ctrl + C`.

> También puedes abrir `index.html` con doble clic, sin servidor. Los ejemplos que consultan una API necesitan internet.

---

## Ruta recomendada

| # | Qué hacer | Dónde | Tiempo orientativo |
|---|---|---|---|
| 1 | Verificar tu ambiente | `npm run verificar` | 10 min |
| 2 | Leer el repaso rápido de toda la teoría | [`00-repaso-rapido/repaso-rapido.html`](00-repaso-rapido/repaso-rapido.html) | 20 min |
| 3 | Repasar HTML y CSS y explorar el laboratorio de CSS | `01-clase-html-css/` | 45 min |
| 4 | Repasar JS, `async/await` y TypeScript | `02-clase-js-ts/` (ejecuta y modifica los ejemplos) | 1 h |
| 5 | Recorrer la Pokédex paso a paso | `03-pokedex-pasos/index.html` | 1 h |
| 6 | Aprender Git básico (ramas, commit, push). **Tema nuevo, no visto en clase**; se retoma en Angular | [video intro de 2:30](https://www.youtube.com/watch?v=DinilgacaWs) → [`docs/GIT-BASICO.md`](docs/GIT-BASICO.md) → [curso completo](https://www.youtube.com/watch?v=T3roQrB_Jko&list=PLJ7sTTLrIA6klMtrvcpGXYkBFoUP3rqwo) (opcional) | 45 min |
| 7 | Leer el enunciado y mirar el wireframe | `04-proyecto/proyecto-estudiante.html` | 20 min |
| 8 | Hacer el proyecto (partes A a D), **una rama de Git por nivel** | `04-proyecto/dragonball/` | varios días |
| 9 | *(Bonus)* Planetas ★ (diseño, código y despliegue) y publicar en Vercel (mira antes el [ejemplo resuelto](https://github.com/JevDev2304/curso-js-ts-api/tree/deploy-vercel-pokeapi-nivel-8)) | [nivel 8 del enunciado](04-proyecto/proyecto-estudiante.html) | 30 min |

---

## Cómo se trabaja con la IA en este curso

Hoy nadie teclea todo desde cero, así que **no tienes que escribir el código a mano**: la IA te lo propone. Pero eso no significa pedirle el proyecto entero y pegarlo. **Tú diriges**:

1. Le das contexto real (tu diseño, el JSON de la API, tus decisiones).
2. Le pides el código **por piezas pequeñas** y le preguntas dónde va y por qué.
3. **Tú lo acomodas** en el archivo y la carpeta correctos dentro de VS Code.
4. Lo **ejecutas**, lo pruebas, y si falla entiendes el error.
5. Se lo **explicas con tus palabras** y lo conversas: preguntas por qué, comparas alternativas y corriges a la IA cuando se equivoca (con esta API pasará).

- **Recomendado: el chat de [Claude](https://claude.ai) o de [Gemini](https://gemini.google.com).** Te da el código en bloques y tú lo acomodas. En [`docs/PROMPTS-CHAT.md`](docs/PROMPTS-CHAT.md) hay un prompt listo para copiar que convierte al chat en tu tutor.
- **Opcional: Claude Code**, ya configurado en este repositorio como tutor con cuatro comandos: `/preparar-ambiente`, `/repasar-clase`, `/asistir-proyecto` y `/asistir-bonus`. Está limitado a propósito: te entrega el código en la conversación en lugar de escribir tus archivos, para que seas tú quien lo acomoda. **Los comandos de Git los escribes tú**; Claude te dice cuál y qué hace. Mira [`docs/USAR-IA.md`](docs/USAR-IA.md).
- **Lo que sí escribes tú, con tus palabras:** las respuestas de análisis (Parte D) y tu README, mínimo un párrafo por respuesta. No pegues texto generado por una IA.
- Todo lo vas a **sustentar en vivo**.

---

## Qué entregas

Tu repositorio de GitHub, **que debe ser público**, con:

- La carpeta `04-proyecto/dragonball/` con tus niveles (`nivel1` … `nivel7`), **subidos a GitHub en una rama por nivel** (`nivel-1` … `nivel-7`; y `bonus-planetas` y `nivel-8` si haces los bonus).
- `04-proyecto/dragonball/README.md` completo (hay una plantilla): tus respuestas, tu diseño, tus decisiones, la bitácora de errores, la bitácora de conversación con la IA y la sección «Mis comandos de Git» con tus palabras.
- *(Bonus)* La URL de tu página publicada en Vercel y, si hiciste el bonus de planetas, su diseño y su código (rama `bonus-planetas`).

Los detalles y la rúbrica están en [`04-proyecto/proyecto-estudiante.html`](04-proyecto/proyecto-estudiante.html).

---

## Comandos útiles (todos se ejecutan en la terminal, dentro de la carpeta del repositorio)

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias (una sola vez) |
| `npm run verificar` | Revisa que tu computador está listo |
| `npm run servir` | Abre los materiales en <http://localhost:5500> |
| `npm run build:pokedex` | Recompila la Pokédex (por si modificas sus `.ts`) |
| `npm run nivel -- 3` | Crea la carpeta `nivel3/` de tu proyecto con la configuración lista |
| `npm run build` | Compila los `main.ts` de tus niveles a `main.js` y revisa los tipos |
| `npm run servir -- 5600` | Abre el servidor en otro puerto si el 5500 está ocupado |

Para Git (rama por nivel, `add`, `commit`, `push`, `pull`) mira [`docs/GIT-BASICO.md`](docs/GIT-BASICO.md).

## ¿Algo no funciona?

1. **Lo más rápido, si tienes Claude Code:** abre `claude` en la carpeta donde clonaste el repositorio y pídele que lo solucione (también puedes escribir `/preparar-ambiente`). Te guía y lo arregla contigo.
2. Lee [`docs/SOLUCION-PROBLEMAS.md`](docs/SOLUCION-PROBLEMAS.md): están los errores más comunes con su solución.
3. Ejecuta `npm run verificar` y fíjate en las líneas con ✗.
4. O pregúntale al chat de Claude o Gemini pegando **el mensaje de error completo**.
5. Si tienes cualquier duda o necesitas ayuda, escríbele a tu profesor: él está atento y te responde en cuanto pueda. Cuéntale tu sistema operativo, el comando que ejecutaste y el mensaje de error completo.
