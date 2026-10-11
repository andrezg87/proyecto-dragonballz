# Solución de problemas

**Lo más rápido, si tienes Claude Code:** abre `claude` en la carpeta del repositorio y pídele que solucione el problema (o escribe `/preparar-ambiente`). Si no, busca tu síntoma en las tablas. Si no aparece, copia **el mensaje de error completo** y pídele ayuda al chat de Claude o Gemini (mira [`PROMPTS-CHAT.md`](PROMPTS-CHAT.md)) o a tu profesor.

## Instalación y terminal

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| `node no se reconoce como un comando` / `command not found: node` | Node.js no está instalado o la terminal se abrió antes de instalarlo | Instala Node.js LTS, **cierra la terminal y abre una nueva**. Si sigue igual, reinicia el computador |
| `npm : No se puede cargar el archivo ... porque la ejecución de scripts está deshabilitada` (Windows PowerShell) | La política de PowerShell bloquea los scripts de npm | Abre PowerShell y ejecuta `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, acepta con `S` y repite el comando |
| `git no se reconoce` / `command not found: git` | Git no está instalado | Instálalo (ver [INSTALACION.md](INSTALACION.md)) y abre una terminal nueva |
| `Author identity unknown` al hacer `git commit` | No configuraste tu nombre y correo | `git config --global user.name "Tu Nombre"` y `git config --global user.email "tu@correo.com"` |
| `code no se reconoce` | El comando `code` no está en el PATH | Abre la carpeta con **File → Open Folder** en VS Code. En Mac: `Cmd+Shift+P` → *Install 'code' command in PATH* |
| `npm install` falla con `EACCES` (permisos) | Estás ejecutando en una carpeta protegida o con `sudo` antes | No uses `sudo`. Clona el repositorio en una carpeta tuya (`Documents`) y repite |
| `npm install` falla con `ENOTFOUND` / `network` | Sin internet, VPN o proxy | Revisa tu conexión, desactiva la VPN y repite |
| `npm run verificar` marca ✗ en **Dependencias** | No ejecutaste `npm install` | Ejecuta `npm install` en la **raíz** del repositorio (la carpeta que contiene `package.json`) |
| `npm run verificar` marca ✗ en **API PokéAPI** o **API Dragon Ball** | Sin conexión, VPN o proxy, o la API está caída un momento | Revisa tu internet y desactiva la VPN. Si solo falla una, espera unos minutos y repite. Sin conexión no funcionan los pasos que usan la API |
| `npm ERR! enoent ... package.json` | Estás en la carpeta equivocada | Usa `cd` hasta la raíz del repositorio. Debe verse `package.json` al ejecutar `ls` / `dir` |

## Materiales y servidor

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| `El puerto 5500 está ocupado` | Otro programa (o una ventana anterior) usa ese puerto | Cierra la otra ventana de terminal o usa `npm run servir -- 5600` y entra a `http://localhost:5600` |
| La página se ve en blanco | Abriste solo el archivo y falló una fuente o un script externo | Ejecuta `npm run servir` y abre `http://localhost:5500`. Revisa que tengas internet |
| Los ejemplos con API muestran «datos simulados» | El visor o tu red bloquea `pokeapi.co` | Es normal en algunos visores. En tu computador con internet usa el modo **Automático** o **Solo API real** (selector del inicio de la guía JS/TS) |
| Las imágenes no cargan en la Pokédex | Sin internet o bloqueador de anuncios | Revisa la conexión y desactiva extensiones que bloqueen `raw.githubusercontent.com` |
| El editor TypeScript de la guía dice «No se pudo cargar TypeScript» | No hay conexión a cdnjs | Conéctate a internet y recarga |

## TypeScript y tu proyecto

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| `npm run build` dice «Todavía no hay niveles con main.ts» | Aún no creaste el nivel 3 o superior | `npm run nivel -- 3` |
| `✗ nivelN: falta nivelN/tsconfig.json` | Creaste la carpeta a mano sin su configuración | Borra la carpeta y créala con `npm run nivel -- N`, o copia el `tsconfig.json` de otro nivel |
| Cambié `main.ts` pero la página no cambia | El navegador carga `main.js`, que se genera al compilar | Ejecuta `npm run build` y recarga con `Ctrl+Shift+R` (`Cmd+Shift+R` en Mac) |
| `Cannot find name 'document'` | Falta la configuración del nivel | El nivel necesita su `tsconfig.json` (créalo con `npm run nivel -- N`) |
| `Property 'x' does not exist on type` | Escribiste mal un campo o tu `interface` no lo declara | Compara el nombre con el JSON real de la API y con tu `interface` |
| `Object is possibly 'null'` | `querySelector` puede no encontrar el elemento | Revisa el `id` en el HTML. Mira cómo lo resuelve la Pokédex (paso 3) |
| `Cannot redeclare block-scoped variable` en VS Code | Dos niveles comparten la misma configuración de TypeScript | Cada nivel con TypeScript necesita su propio `tsconfig.json` |
| La lista sale vacía y no hay errores | El arreglo de resultados tiene otro nombre en esta API | Abre la URL de la API en el navegador y compara el nombre real con tu `interface` |
| `Unexpected token < in JSON` | La respuesta no era JSON (una página de error, una URL mal escrita) | Imprime `respuesta.status` y abre la URL en el navegador |
| Error de CORS en la consola | La API no permite peticiones desde el navegador | Para las APIs de este curso no debería pasar. Revisa la URL y que estés en `http://localhost` o en una URL `https` |

## Git y GitHub

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| `Permission denied` / `Authentication failed` al hacer `git push` | GitHub ya no acepta contraseñas en la terminal | Usa **GitHub Desktop**, o crea un *Personal Access Token* (Settings → Developer settings), o inicia sesión con `gh auth login` si tienes GitHub CLI |
| `git clone` dice `Repository not found` | La dirección está mal escrita o el repositorio es privado | Copia la dirección desde el botón verde **Code** de GitHub. Tu repositorio debe ser **público** (Settings → General → Change visibility) |
| No veo el botón **Use this template** | Estás en una copia que ya no es la plantilla, o no iniciaste sesión | Inicia sesión en GitHub y entra al repositorio original: <https://github.com/JevDev2304/curso-js-ts-api>. Si sigue sin aparecer, usa **Fork** |
| `fatal: not a git repository` | Estás fuera de la carpeta del repositorio | `cd` hasta la raíz del repositorio |
| `rejected ... non-fast-forward` | El repositorio remoto tiene cambios que no tienes | `git pull` y luego `git push` |
| Hice `commit` pero GitHub no muestra mis cambios | El commit solo está en tu computador | `git push` (la primera vez de una rama: `git push -u origin nombre-de-la-rama`) |
| `fatal: a branch named 'nivel-1' already exists` | Esa rama ya existe | Muévete a ella con `git checkout nivel-1` (sin `-b`) |
| `error: Your local changes ... would be overwritten by checkout` | Tienes cambios sin guardar y quieres cambiar de rama | `git add .` y `git commit -m "..."`, y vuelve a intentar |
| `The current branch ... has no upstream branch` | Es la primera vez que subes esa rama | `git push -u origin nombre-de-la-rama` |
| Subí `node_modules` por error | Falta el `.gitignore` | Ya viene en el repositorio; no lo borres. Pide ayuda para quitarlo del historial |

> Más ejemplos de lo que Git te dice y qué hacer: [`GIT-BASICO.md`](GIT-BASICO.md#3b-cómo-leer-lo-que-git-te-dice-con-ejemplos-reales).

## Vercel (bonus)

> Si dudas de tu configuración, compárala con el [ejemplo resuelto](https://github.com/JevDev2304/curso-js-ts-api/tree/deploy-vercel-pokeapi-nivel-8) (rama `deploy-vercel-pokeapi-nivel-8`, archivo `DEPLOY-VERCEL.md`).

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| `No Output Directory named "public" found after the Build completed` | Vercel compiló, pero no encontró la carpeta que debe publicar: la rama que está desplegando no tiene `04-proyecto/dragonball/nivel7`. Pasa, por ejemplo, si despliega `main` | En Vercel → **Settings → Environments → Production → Branch Tracking** = `nivel-8` → Save, y luego **Deployments → Create Deployment** con la rama `nivel-8`. En GitHub comprueba que la rama `nivel-8` muestra tu carpeta `nivel7` (si no, falta `git push` de esa rama). Deja Root Directory, Build Command y Output Directory **sin cambios** (los define el `vercel.toml`) |
| `✗ No encuentro 04-proyecto/dragonball/nivel7/index.html` en el registro de Vercel | Lo mismo: la rama desplegada no tiene tu nivel 7 | Igual que arriba |
| El primer despliegue (de `main`) falla al importar el repositorio | Es normal: `main` solo tiene los materiales, no tu `nivel7` | Cambia el Branch Tracking de Production a `nivel-8` y crea el despliegue de esa rama (Deployments → Create Deployment) |
| En el diálogo **Redeploy** no puedo elegir otra rama | Redeploy repite el **mismo código** del último despliegue (el de `main`); nunca cambia de rama | Cambia el Branch Tracking (Settings → Environments → Production) y usa **Deployments → Create Deployment** escribiendo el nombre de la rama, o haz un `git push` en esa rama |
| En el registro aparece «Todavía no hay niveles con main.ts. Crea el nivel 3 con…» | Vercel compiló un repositorio sin tus niveles (la plantilla vacía) | Despliega **tu** repositorio, rama `nivel-8`, que ya contiene tu trabajo |
| El Build falla con errores de TypeScript | Tu `nivel7/main.ts` tiene errores de tipos | Ejecuta `npm run build` en tu computador, corrige y sube de nuevo. Vercel hace lo mismo que ese comando |
| Al abrir la URL, Vercel pide **iniciar sesión** (a ti o a quien la visita) | Vercel protege por defecto las URLs de cada despliegue y de las ramas; solo las abre quien tenga cuenta | Comparte el **dominio de producción** (el corto, en *Domains*). Si sigue pidiendo login: **Settings → Deployment Protection → Vercel Authentication → desactivar → Save**. Pruébalo siempre en una ventana de incógnito |
| Error 404 al abrir la URL | Falta `index.html` dentro de `nivel7` | Comprueba que está en `04-proyecto/dragonball/nivel7/index.html` |
| La página carga pero sin datos | La ruta del `<script src>` está mal escrita o falló el build | Debe ser `<script src="main.js"></script>`. Revisa el registro del despliegue y DevTools → Console |
| Funciona en tu PC y no en Vercel | Mayúsculas y minúsculas en nombres de archivo (`Main.js` ≠ `main.js`) | Revisa que el nombre del `<script src>` coincida exacto con el archivo |

## Claude Code (opcional)

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| `claude: command not found` | Claude Code no está instalado o el PATH no se actualizó | Instálalo (ver [USAR-IA.md](USAR-IA.md#instalación)), cierra y abre la terminal. Ejecuta `claude doctor` para diagnosticar |
| Dice que no tienes acceso | Se necesita un plan de pago (Pro o superior) | Inicia sesión con una cuenta que lo tenga |
| Claude Code me pide permiso para cada comando | Es normal: pide confirmación antes de ejecutar comandos | Acepta los del curso (`npm install`, `npm run verificar`, `npm run build`…). Si no entiendes uno, pregúntale qué hace antes de aceptar |
| Claude Code no ejecuta `git add`, `commit` ni `push` por mí | Es a propósito: los comandos de Git los escribes tú para aprender | Pídele que te explique qué hace el comando y cuál escribir, y ejecútalo tú. Luego puede comprobar el resultado con `git status` |
| «BLOQUEADO por el tutor» | El guardarraíl impidió que Claude escribiera tus archivos | Es intencional: Claude te entrega el código en la conversación y tú lo acomodas en VS Code. Pídele la pieza en el chat |

## Cuando nada de lo anterior sirve

Tu profesor está atento: escríbele cuando tengas cualquier duda o necesites ayuda, y te responde en cuanto pueda. Para ayudarte más rápido, cuéntale en un solo mensaje:

1. Tu sistema operativo (Windows 11, macOS 14, Ubuntu…).
2. La salida completa de `npm run verificar`.
3. El comando que ejecutaste y el mensaje de error **completo** (copia y pega, no captura parcial).
