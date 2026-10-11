# Git básico: lo mínimo que necesitas

En este proyecto vas a usar Git de verdad: **una rama por nivel**, subida a **tu GitHub**. Esta guía tiene lo justo, sin complicarlo.

> **Git es tema nuevo:** no se vio en clase, así que no se espera que lo sepas de antes. Lo aprendes aquí, practicando. Más adelante, mientras trabajan Angular, se retomará todo esto y se verán más cosas: **Pull Requests, Issues, hotfixes** y el trabajo en equipo con ramas. Por ahora basta con lo de esta guía.

> 🎬 **Empieza por aquí (2 min 30 s):** [¿Qué es Git y GitHub? Repositorios, ramas y mucho más](https://www.youtube.com/watch?v=DinilgacaWs). Te da la idea general de qué es Git, GitHub, un repositorio y una rama antes de ver los comandos.
>
> 🎥 **Para profundizar:** [Curso de Git y GitHub (desde cero)](https://www.youtube.com/watch?v=T3roQrB_Jko&list=PLJ7sTTLrIA6klMtrvcpGXYkBFoUP3rqwo) (en español; es una lista de reproducción). Míralo antes de empezar o cuando algo no te cuadre. No tienes que verlo completo: con esta guía alcanza para el proyecto.
>
> ⏱️ **Curso de 1 hora (en inglés, activa los subtítulos):** [Git Tutorial for Beginners: Learn Git in 1 Hour](https://www.youtube.com/watch?v=8JJ101D3knE).

---

## 1. Las ideas en 1 minuto

| Palabra | Qué es | Analogía |
|---|---|---|
| **Git** | Programa en tu computador que guarda el historial de tu proyecto | Un «guardado de partida» de un videojuego, con todas las versiones |
| **GitHub** | Página web donde se guarda una copia de tu repositorio en internet | La nube donde dejas tus partidas guardadas |
| **Repositorio** | Tu carpeta del proyecto con todo su historial | La partida completa |
| **Commit** | Un punto de guardado con un mensaje | «Guardé aquí: terminé el nivel 3» |
| **Rama (branch)** | Una línea de trabajo paralela | Un universo alterno donde pruebas sin dañar el principal |
| **Remoto (origin)** | La copia de tu repositorio que está en GitHub | La partida en la nube |

Tu trabajo viaja así:

```
 tu carpeta        zona de preparación        historial local         GitHub
(editas archivos)   ──git add──▶  (staging)  ──git commit──▶  (commits)  ──git push──▶  (en la nube)
                                                                          ◀──git pull──
```

---

## 2. Los comandos (todos se escriben en la terminal, dentro de la carpeta del repositorio)

| Comando | Qué hace | Cuándo lo usas |
|---|---|---|
| `git clone URL` | Copia un repositorio de GitHub a tu computador | **Una sola vez**, al empezar |
| `git status` | Te dice en qué rama estás y qué archivos cambiaron | **Siempre**, antes de hacer otra cosa. Es tu brújula |
| `git branch` | Lista tus ramas (la que tiene `*` es en la que estás) | Para saber qué ramas tienes |
| `git checkout -b nivel-1` | **Crea** la rama `nivel-1` y **te mueve** a ella | Al empezar cada nivel |
| `git checkout nivel-1` | **Te mueve** a una rama que ya existe | Para cambiar de rama |
| `git add .` | Prepara **todos** los cambios para guardarlos (el punto significa «todo») | Antes de cada commit |
| `git commit -m "mensaje"` | Guarda un punto en el historial con tu mensaje | Cuando terminas algo que funciona |
| `git push -u origin nivel-1` | Sube la rama a GitHub **por primera vez** | La primera vez de cada rama |
| `git push` | Sube tus commits nuevos a GitHub | Cada vez que quieras respaldar |
| `git pull` | Trae de GitHub los cambios que no tienes | Si trabajas desde dos computadores o GitHub tiene algo nuevo |
| `git log --oneline` | Muestra el historial de commits, uno por línea | Para ver qué has guardado |

> **`checkout` y `switch`:** en Git moderno también existe `git switch nivel-1` (moverse) y `git switch -c nivel-1` (crear y moverse). Hacen lo mismo que `checkout`. En este curso usamos `checkout`; si ves `switch` en un video, es lo mismo.

### Qué hace cada uno, un poco más a fondo

- **`git add`** no guarda nada todavía: solo **marca** qué cambios van en el próximo commit. Es como poner las cosas en una caja antes de sellarla.
- **`git commit`** **sella la caja** y la guarda en el historial **de tu computador**. Todavía nada está en internet.
- **`git push`** **envía** las cajas selladas a GitHub. Hasta que no haces push, GitHub no se entera.
- **`git pull`** hace lo contrario: **trae** de GitHub lo nuevo y lo mezcla con tu carpeta.
- **Una rama** es una línea de commits independiente. Cuando haces `checkout` a otra rama, **tus archivos cambian** para mostrar el estado de esa rama.

---

## 3. Tu flujo en el proyecto: una rama por nivel

Cada nivel nace de la rama del nivel anterior, así tu código se va acumulando.

> **Ojo con los nombres:** la **rama** se llama `nivel-1` (con guion) y la **carpeta** donde pones tus archivos se llama `nivel1` (sin guion, la crea `npm run nivel -- 1`). Son cosas distintas: dentro de la rama `nivel-1` trabajas en la carpeta `dragonball/nivel1/`.

```
main ── (materiales del curso)
  └─ nivel-1 ── nivel-2 ── nivel-3 ── ... ── nivel-7 ── nivel-8 (bonus: la que despliegas)
```

### Paso a paso con el nivel 1

```bash
# 0. Antes de empezar: ¿dónde estoy y está todo limpio?
git status

# 1. Crear la rama del nivel 1 y moverme a ella
git checkout -b nivel-1

# 2. (Trabaja: crea tus archivos, acomoda el código, pruébalo)

# 3. Ver qué cambió
git status

# 4. Preparar los cambios para guardarlos
git add .

# 5. Guardarlos con un mensaje claro
git commit -m "Nivel 1: HTML con 5 personajes"

# 6. Subir la rama a mi GitHub (la primera vez lleva -u origin)
git push -u origin nivel-1
```

### Del nivel 1 al nivel 2

Estando en `nivel-1` y con todo guardado, creas la siguiente rama **desde ahí**:

```bash
git status                 # debe decir "nothing to commit, working tree clean"
git checkout -b nivel-2    # nace desde nivel-1, con todo tu trabajo anterior
# ... trabajas ...
git add .
git commit -m "Nivel 2: CSS con la paleta de Dragon Ball"
git push -u origin nivel-2
```

Y así hasta el `nivel-7`. Puedes hacer **varios commits dentro de un mismo nivel** (uno por cada pieza que funcione): es mejor que un solo commit gigante.

### Para moverte entre niveles y ver cómo estaba cada uno

```bash
git branch                 # ver tus ramas
git checkout nivel-3       # ir al nivel 3: tus archivos cambian a como estaban ahí
git checkout nivel-7       # volver al último
```

> **Antes de cambiar de rama, guarda tu trabajo** (`git add .` y `git commit`). Si no, Git te avisará de que tus cambios se perderían y no te dejará moverte.

### Mensajes de commit: cómo escribirlos

Cortos, en español y diciendo **qué lograste**:

- ✅ `Nivel 4: getJSON y adaptador de personajes`
- ✅ `Arreglo: el ki viene como texto`
- ❌ `cambios`, `listo`, `asdf`

### Nivel 8 (bonus): una rama para publicar en Vercel

El bonus tiene su propia rama, igual que los demás niveles: **`nivel-8`**. Nace de `nivel-7` y es la que vas a desplegar. No hace falta tocar `main`.

> **Si hiciste también el bonus de planetas:** el código de planetas va en una rama `bonus-planetas` creada desde `nivel-7`, y `nivel-8` nace **desde `bonus-planetas`** (`git checkout bonus-planetas`, `git checkout -b nivel-8`), para que la página publicada incluya los planetas.

```bash
git checkout nivel-7             # parte de tu último nivel
git status                       # debe estar limpio
git checkout -b nivel-8          # crea la rama del bonus y te mueve a ella
git push -u origin nivel-8       # súbela a GitHub
```

En Vercel le indicas esa rama en **Settings → Environments → Production → Branch Tracking** (el enunciado y `DEPLOY-VERCEL.md` explican cómo). Cada `git push` que hagas desde `nivel-8` vuelve a publicar tu página.

---

## 3b. Cómo leer lo que Git te dice (con ejemplos reales)

Git siempre te cuenta qué está pasando. Aprender a leerlo es la mitad del trabajo.

**1) Acabas de crear archivos nuevos**

```text
$ git status
On branch nivel-1
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        04-proyecto/dragonball/nivel1/

nothing added to commit but untracked files present
```

> «Estás en la rama `nivel-1`. Hay archivos nuevos que todavía no sigo.» → `git add .`

**2) Los preparaste**

```text
$ git add .
$ git status
On branch nivel-1
Changes to be committed:
        new file:   04-proyecto/dragonball/nivel1/index.html
```

> «Están en la caja, listos para el commit.» → `git commit -m "..."`

**3) Hiciste el commit**

```text
$ git commit -m "Nivel 1: HTML con 5 personajes"
[nivel-1 5be30ca] Nivel 1: HTML con 5 personajes
 1 file changed, 40 insertions(+)
 create mode 100644 04-proyecto/dragonball/nivel1/index.html

$ git status
On branch nivel-1
nothing to commit, working tree clean
```

> `5be30ca` es el código de tu commit. «Working tree clean» = todo está guardado.

**4) Lo subiste a GitHub**

```text
$ git push -u origin nivel-1
 * [new branch]      nivel-1 -> nivel-1
branch 'nivel-1' set up to track 'origin/nivel-1'.

$ git log --oneline
5be30ca (HEAD -> nivel-1, origin/nivel-1) Nivel 1: HTML con 5 personajes
```

> `origin/nivel-1` junto al commit confirma que GitHub tiene el mismo punto que tu computador.

**5) Cambiaste un archivo que ya estaba guardado**

```text
$ git status
On branch nivel-1
Changes not staged for commit:
        modified:   04-proyecto/dragonball/nivel1/index.html
```

> «Modificaste este archivo y todavía no lo preparas.» → `git add .` y `git commit`.

**6) Intentas cambiar de rama sin haber guardado**

```text
$ git checkout main
error: Your local changes to the following files would be overwritten by checkout:
        04-proyecto/dragonball/nivel1/index.html
Please commit your changes or stash them before you switch branches.
Aborting
```

> Git te protege: no te deja cambiar de rama para que no pierdas cambios. Haz `git add .` y `git commit`, y vuelve a intentar.

> Si tu Git está en español, los mensajes dicen lo mismo con otras palabras («En la rama…», «nada para hacer commit»).

### Qué es `.gitignore`

Es un archivo que le dice a Git **qué no subir**. En este repositorio ya ignora `node_modules/` (la carpeta de dependencias, que se recrea con `npm install`) y archivos del sistema. No lo borres.

### Preguntas que todos se hacen

| Pregunta | Respuesta corta |
|---|---|
| ¿Pierdo mi trabajo al cambiar de rama? | No: queda guardado en su rama. Pero primero tienes que hacer `add` y `commit` de lo que tengas pendiente |
| ¿Cuándo hago commit? | Cada vez que algo funciona. Mejor varios commits pequeños que uno gigante |
| Hice `commit` pero GitHub no lo muestra | Falta el `git push`. El commit solo se guarda en tu computador |
| ¿Qué es `origin`? | El nombre por defecto de tu repositorio en GitHub |
| ¿Qué es `HEAD`? | La rama (y el commit) donde estás parado ahora mismo |
| ¿Puedo borrar algo que ya hice commit? | Sí, y el historial lo recuerda: siempre puedes volver a un commit anterior |

---

## 4. Lo que debes entregar sobre Git

1. Tu repositorio de GitHub es **público** (Settings → General → *Danger Zone* → *Change visibility* → Public, o márcalo como Public al crearlo). Tu profesor necesita poder verlo y Vercel lo necesita para publicarlo.
2. En tu GitHub existen las ramas `nivel-1` … `nivel-7` (y `nivel-8` si haces el bonus), además de `main`.
3. Cada nivel tiene al menos un commit con un mensaje claro.
4. En tu `README.md` de `04-proyecto/dragonball/`, la sección **«Mis comandos de Git»** completa **con tus palabras** (qué hace cada comando y cuándo lo usaste).

---

## 5. Si algo sale mal

| Mensaje o síntoma | Qué significa | Qué hacer |
|---|---|---|
| `nothing to commit, working tree clean` | No hay cambios nuevos que guardar | Está bien. Revisa que guardaste el archivo en VS Code (`Ctrl+S`) |
| `error: Your local changes ... would be overwritten by checkout` | Tienes cambios sin guardar y quieres cambiar de rama | `git add .` y `git commit -m "..."` y vuelve a intentar |
| `fatal: a branch named 'nivel-1' already exists` | Esa rama ya existe | Muévete a ella con `git checkout nivel-1` (sin `-b`) |
| `Author identity unknown` | Git no sabe quién eres | `git config --global user.name "Tu Nombre"` y `git config --global user.email "tu@correo.com"` |
| `The current branch nivel-2 has no upstream branch` | Es la primera vez que subes esa rama | `git push -u origin nivel-2` (copia el comando que te sugiere Git) |
| `rejected ... fetch first` / `non-fast-forward` | GitHub tiene algo que tú no | `git pull` y luego `git push` |
| `Permission denied` / `Authentication failed` | GitHub no te reconoce desde la terminal | Mira [`SOLUCION-PROBLEMAS.md`](SOLUCION-PROBLEMAS.md), sección Git y GitHub |
| «Estoy perdido, ¿en qué rama estoy?» | — | `git status` y `git branch`. Siempre te lo dicen |

---

## 6. Regla de oro para aprender

**Escribe los comandos de Git tú mismo**, aunque uses una IA para entenderlos. Si alguien (o algo) los ejecuta por ti, no aprendes lo que hace cada uno. Antes de ejecutar un comando, dilo con tus palabras: «con esto voy a guardar mis cambios en el historial». Después comprueba el resultado con `git status` o `git log --oneline`.
