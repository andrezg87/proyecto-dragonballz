# Cómo trabajar con la IA en este curso

**La idea:** hoy casi nadie escribe todo el código a mano, así que aquí **tampoco tienes que hacerlo**. La IA te propone el código; **tú diriges, acomodas, ejecutas, entiendes y conversas**. Lo que se evalúa es que puedas explicar lo que construiste, no que hayas tecleado cada línea.

## El ciclo de cada pieza de código

| # | Qué haces | Ejemplo |
|---|---|---|
| 1 | **Le das contexto real** | Pegas tu diseño, el JSON que viste en la API y tus decisiones |
| 2 | **Le pides UNA pieza pequeña** y que te diga dónde va y por qué | «Dame solo la `interface` del personaje, y dime en qué archivo y en qué lugar va» |
| 3 | **La acomodas tú en VS Code** | Creas o abres el archivo, pegas en el lugar indicado |
| 4 | **La ejecutas** | `npm run build`, recargas el navegador, miras qué pasa |
| 5 | **Si falla, entiendes el error** antes de pedir el arreglo | «Creo que dice que el campo no existe porque…» |
| 6 | **Se la explicas con tus palabras** y la conversas | «Entonces `getJSON` espera la respuesta y la convierte, ¿cierto? ¿Y por qué es genérica?» |

Solo después de los pasos 3 a 6 pides la siguiente pieza.

### Qué NO es trabajar bien con la IA

- Pedir «hazme todo el nivel 4» y pegar el resultado sin ejecutarlo ni leerlo.
- Pegar código sin saber en qué archivo está.
- Aceptar el código sin comprobarlo contra **tu** JSON real. **Con esta API pasará:** la IA suele dar código «típico» de PokéAPI que aquí falla (el nombre del arreglo, el `ki` como texto, la respuesta con filtro…). Detectarlo es parte del trabajo.

### Qué SÍ es trabajar bien con la IA

- Pegarle tu error completo y preguntarle qué significa.
- Preguntarle «¿por qué aquí y no antes?» o «¿qué pasaría si quito este `await`?».
- Pedirle dos alternativas y elegir con un motivo.
- Corregirla cuando se equivoca. Eso va a tu **bitácora de conversación** (3 momentos mínimo).

## Lo que escribes tú, con tus palabras

- Tus **respuestas de análisis (Parte D)**: un párrafo como mínimo por pregunta, sin pegar texto generado por una IA.
- Tu **README** de `dragonball/`, incluida la bitácora de conversación.

Y todo lo sustentas en vivo.

---

## Dos formas de usar la IA

| | Chat de Claude o Gemini | Claude Code (tutor del repositorio) |
|---|---|---|
| Qué es | La página web o app de siempre | Un programa en tu terminal que lee tu repositorio |
| Se recomienda para | **Escribir el proyecto.** Es lo más simple | **Instalar y preparar el ambiente** (guía paso a paso), y el proyecto si ya te sientes cómodo con la terminal |
| Cómo te da el código | En bloques en la conversación; tú lo acomodas | También en bloques en la conversación; **no escribe tus archivos** |
| Costo | Gratis o tu plan | Requiere plan de pago de Claude |
| Dónde se configura | [`PROMPTS-CHAT.md`](PROMPTS-CHAT.md) | Este documento |

> **Recomendación:** para **instalar**, deja que Claude Code te guíe (ver [`INSTALACION.md`](INSTALACION.md#camino-a-recomendado-claude-code-te-guía)). Para **escribir el proyecto**, empieza con el **chat**: con agentes que escriben los archivos por ti (Claude Code u OpenCode sin límites) no acomodas nada y se aprende menos. Si usas Claude Code para el proyecto, este repositorio ya lo configura para que te entregue el código en la conversación y no escriba tus archivos.

---

## Opción 1 (recomendada): el chat de Claude o Gemini

1. Abre <https://claude.ai> o <https://gemini.google.com>.
2. Copia el **prompt de tutor** de [`PROMPTS-CHAT.md`](PROMPTS-CHAT.md) y pégalo al empezar la conversación.
3. Trabaja con el ciclo de arriba. Tienes prompts listos para cada momento: pedir una pieza, entender un error, comprobar tu explicación, revisar tu diseño, el bonus de Vercel.

---

## Opción 2: Claude Code como tutor

### Qué necesitas

- Un plan de Claude de pago (Pro o superior) o una cuenta de Console.
- El ambiente listo (`npm run verificar` sin ✗), o dejar que la primera skill lo prepare.

### Instalación

Si ya tienes `claude --version`, salta a [Primer uso](#primer-uso). Si no, abre una terminal y ejecuta el comando de tu sistema ([documentación oficial](https://code.claude.com/docs/en/setup)):

**Mac, Linux o WSL**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://claude.ai/install.ps1 | iex
```

Cierra y abre la terminal, y comprueba:

```bash
claude --version
```

### Primer uso

**Si todavía no tienes el repositorio en tu computador:** usa el **prompt de arranque** de [`INSTALACION.md`](INSTALACION.md#camino-a-recomendado-claude-code-te-guía). Claude te guía paso a paso, explicando, para instalar, crear tu repositorio y verificar todo, y al final te dice cuándo abrir Claude Code dentro de él.

**Si ya tienes el repositorio:**

1. Entra a la carpeta: `cd NOMBRE-DE-TU-REPO`
2. Inicia Claude Code: `claude` (la primera vez abre el navegador para iniciar sesión).
3. Claude Code lee `CLAUDE.md`, que le asigna el rol de **tutor**.
4. Si algo de tu ambiente falla, escribe `/preparar-ambiente`. Si quieres repasar, `/repasar-clase`. Si trabajas en el proyecto, `/asistir-proyecto`.

**Permisos:** Claude Code te va a pedir permiso para ejecutar algunos comandos. Los del curso (`npm install`, `npm run verificar`, `npm run build`…) puedes aceptarlos; si no entiendes uno, pregúntale qué hace antes.

### Los cuatro comandos (skills)

| Comando | Cuándo usarlo | Qué hace por ti | Qué NO hace |
|---|---|---|---|
| `/preparar-ambiente` | La primera vez, o si algo no funciona en tu computador | Te guía paso a paso y explicando: verifica e instala lo que falte (Node, dependencias, Git), configura tu identidad de Git y abre el servidor local. Resuelve los errores contigo sin frenarte | No toca tu código |
| `/repasar-clase` | Quieres repasar lo visto en clase (HTML/CSS, JS, `async/await`, TypeScript, Pokédex) | Te hace preguntas, te pone mini quiz y te manda a comprobar en los ejemplos. Te dice qué dominas y qué repasar. **Git y Vercel no se vieron en clase**: los trata como temas nuevos, no como repaso | No hace tu proyecto |
| `/asistir-proyecto` | Estás trabajando en el proyecto Dragon Ball | Te entrega el código **por piezas pequeñas** en el chat, con archivo, lugar y por qué; crea la estructura de cada nivel, compila, te explica los errores, te dice qué comando de Git escribir y por qué (**los escribes tú**) y te pide explicar cada pieza antes de seguir | No escribe tus archivos, ni tus respuestas de análisis, ni tu README |
| `/asistir-bonus` | Quieres publicar en Vercel (nivel 8; incluye los planetas si hiciste ese bonus) | Te dice qué comandos de Git escribir para la rama `nivel-8` (los escribes tú) y te guía en Vercel: rama de producción, despliegue y que la página sea pública. Diagnostica errores de despliegue | No maneja tus contraseñas; tú inicias sesión |

### Qué está limitado y por qué

Este repositorio incluye un **guardarraíl** (`.claude/`) que impide que Claude Code:

- cree o modifique los archivos de `04-proyecto/dragonball/` (HTML, CSS, TypeScript, JavaScript) ni tu `README.md`,
- modifique los materiales de clase, el tutor (`CLAUDE.md`) o su propia configuración,
- ejecute comandos de Git que cambian algo (`add`, `commit`, `push`, `checkout`, `merge`…). **Esos los escribes tú**, para aprender qué hace cada uno.

Sí puede leer todo, ejecutar los comandos del curso (`npm run verificar`, `npm run build`, `npm run nivel`), consultar Git sin cambiar nada (`git status`, `git log`, `git branch`) y modificar archivos de configuración (como `package.json` o `.gitignore`).

Si ves un mensaje **«BLOQUEADO por el tutor»**, es esperado: Claude Code te va a entregar el código en la conversación para que **tú** lo acomodes, o te va a decir qué comando de Git escribir.

> **Con total honestidad:** es una barrera de fricción, no de seguridad. Es tu computador y podrías desactivarla. Pero entonces ya no acomodas nada, y en la sustentación tendrás que explicar partes que no acomodaste ni probaste.

### Si algo falla con Claude Code

Ejecuta `claude doctor` y mira [`SOLUCION-PROBLEMAS.md`](SOLUCION-PROBLEMAS.md).

---

## Resumen de reglas del curso

1. La IA **propone el código**; tú **diriges, acomodas, ejecutas y entiendes**.
2. Una **pieza pequeña** a la vez, con archivo, lugar y motivo.
3. Todo se **comprueba contra tu JSON real**.
4. **Tus respuestas de análisis (Parte D) y tu README** son un párrafo como mínimo, en tus palabras, sin pegar texto de una IA.
5. Guardas 3 momentos en que **cuestionaste o corregiste** a la IA (bitácora de conversación).
6. Para el diseño puedes usar **Claude Design** o Google Stitch.
7. Los **comandos de Git los escribes tú** (guía en [`GIT-BASICO.md`](GIT-BASICO.md); Git es un tema nuevo, no visto en clase).
8. Todo lo vas a **sustentar en vivo**.
