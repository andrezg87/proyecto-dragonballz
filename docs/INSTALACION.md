# Guía de instalación

Hay dos caminos. **Si ya tienes Claude Code instalado, el camino A es el recomendado**: tu propio Claude te guía paso a paso, te explica cada cosa y resuelve los errores contigo, sin que tengas que descifrar una guía larga. El camino B es la guía manual de siempre, por si prefieres hacerlo tú o no tienes Claude Code (para instalarlo, mira [`USAR-IA.md`](USAR-IA.md#instalación)).

## Camino A (recomendado): Claude Code te guía

**Lo único que haces tú:** abrir una terminal, escribir `claude` y pegar el prompt de abajo. El resto lo hace Claude contigo.

1. Abre una terminal (Windows: busca **PowerShell**; Mac: **Terminal**; Linux: `Ctrl+Alt+T`).
2. Escribe `claude` y pulsa Enter. Puedes hacerlo desde cualquier carpeta; todavía no hace falta tener el repositorio.
3. Pega este prompt completo y pulsa Enter:

```text
Actúa como mi guía de instalación y tutor para un curso de JavaScript y TypeScript. Voy a trabajar con este repositorio plantilla: https://github.com/JevDev2304/curso-js-ts-api

Cómo quiero que me ayudes:
- Guíame PASO A PASO, un paso por vez, y en 1 o 2 frases explícame qué hace cada cosa y para qué sirve, sin tecnicismos.
- Ejecuta tú los comandos de instalación y verificación. Pídeme confirmación solo antes de instalar programas o de cambiar mi configuración global de Git.
- Si algo falla, explícame el error con palabras simples, resuélvelo y sigue. No me frenes por detalles menores ni me hagas preguntas innecesarias.
- No me des listas largas: dime el siguiente paso, espera a que lo hagamos y continúa.

Los pasos que quiero hacer:
1. Descubre mi sistema operativo y comprueba si tengo Node.js (versión 20 o superior), npm, Git y VS Code. Ayúdame a instalar lo que falte.
2. Pregúntame mi nombre y mi correo de GitHub y configura Git con ellos.
3. Explícame cómo crear MI repositorio desde la plantilla (botón "Use this template", en el navegador, dejándolo Público). Pregúntame mi usuario de GitHub y el nombre que le puse, y clónalo en mi carpeta Documentos.
4. Entra a la carpeta del repositorio, ejecuta npm install y luego npm run verificar, y explícame el resultado.
5. Al terminar, dime que cierre esta sesión, abra Claude Code dentro de la carpeta del repositorio y escriba /repasar-clase.

Empieza preguntándome qué sistema operativo uso.
```

4. **Sigue la conversación.** Claude te va diciendo el siguiente paso, lo ejecuta y te explica qué hizo. Cuando te pida ejecutar algo en el navegador (por ejemplo crear tu repositorio con *Use this template*), hazlo y cuéntale cómo te fue.
5. Claude Code te pedirá **permiso** para ejecutar algunos comandos. Son los comandos de instalación y verificación del curso: puedes aceptarlos. Si no entiendes un comando, pregúntale qué hace antes de aceptar.

Al terminar, tu ambiente queda verificado y ya estás dentro del repositorio con el tutor del curso configurado.

> **Si más adelante algo deja de funcionar,** abre `claude` dentro de la carpeta del repositorio y escribe `/preparar-ambiente`. Te guía igual, paso a paso, y arregla lo que falte.

---

## Camino B: guía manual

Esta guía asume que **nunca** has configurado un ambiente de programación. Si ya tienes Node.js, Git y VS Code, salta al [Paso 5](#paso-5-trae-el-repositorio-y-verifica).

Tiempo estimado: 20 a 30 minutos.

---

### Antes de empezar: qué es la terminal

La **terminal** es una ventana donde escribes comandos en vez de hacer clic. La vas a usar poco, pero la necesitas.

| Sistema | Cómo abrirla |
|---|---|
| **Windows** | Menú Inicio → escribe **PowerShell** → ábrelo |
| **Mac** | `Cmd + Espacio` → escribe **Terminal** → Enter |
| **Linux** | `Ctrl + Alt + T` |

Comandos básicos que te servirán:

| Comando | Qué hace |
|---|---|
| `pwd` (Mac/Linux) o `cd` (Windows) | Muestra en qué carpeta estás |
| `ls` (Mac/Linux) o `dir` (Windows) | Lista los archivos de la carpeta |
| `cd nombre-carpeta` | Entra a una carpeta |
| `cd ..` | Sube una carpeta |

> **Regla de oro:** después de instalar un programa, **cierra la terminal y abre una nueva**. Si no, no lo reconoce.

---

### Paso 1: instala Node.js

**Node.js** permite ejecutar JavaScript fuera del navegador y trae **npm**, el programa que descarga librerías (por ejemplo TypeScript).

1. Entra a <https://nodejs.org> y descarga la versión **LTS** (la recomendada).
2. Ábrela y pulsa «Siguiente» hasta terminar. **Deja marcadas las opciones por defecto.**
3. Cierra la terminal, abre una nueva y comprueba:

```bash
node --version
npm --version
```

Debe salir algo como `v22.x.x` y `10.x.x`. Si Node muestra `v18` o menor, instala la LTS. Si dice «no se reconoce» o «command not found», reinicia el computador y prueba de nuevo.

<details>
<summary>Linux (opcional)</summary>

Lo más cómodo es **nvm**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# cierra y abre la terminal, luego:
nvm install --lts
```

</details>

---

### Paso 2: instala Git

**Git** guarda el historial de tu código y permite subirlo a GitHub.

- **Windows:** descarga <https://git-scm.com/downloads/win> y deja las opciones por defecto.
- **Mac:** abre la Terminal y escribe `git --version`. Si no está instalado, el sistema te ofrece instalarlo: acepta.
- **Linux:** `sudo apt install git` (Ubuntu/Debian) o el equivalente de tu distribución.

Comprueba:

```bash
git --version
```

Luego dile a Git quién eres (usa **tu** nombre y **tu** correo, el mismo de tu cuenta de GitHub):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

---

### Paso 3: instala Visual Studio Code

**VS Code** es el editor donde escribirás tu código.

1. Descárgalo en <https://code.visualstudio.com> e instálalo.
2. Ábrelo. Cuando abras el repositorio, te propondrá instalar unas **extensiones recomendadas** (Tailwind CSS IntelliSense, Error Lens, Prettier). Acepta.
3. **Comando `code`** (para abrir carpetas desde la terminal):
   - Windows: lo instala solo.
   - Mac: en VS Code pulsa `Cmd + Shift + P`, escribe **Shell Command: Install 'code' command in PATH** y Enter.

Comprueba con `code --version`. Si no funciona, no pasa nada: puedes abrir la carpeta desde VS Code con **File → Open Folder**.

---

### Paso 4: cuenta de GitHub

1. Crea una cuenta gratuita en <https://github.com>.
2. Verifica tu correo.
3. La usarás para guardar tu proyecto con Git (**Git es un tema nuevo, se explica en [`GIT-BASICO.md`](GIT-BASICO.md)**) y, si haces el bonus, para publicarlo en Vercel. Tu repositorio debe ser **público**.

---

### Paso 5: trae el repositorio y verifica

#### 5.1 Consigue tu copia

**Opción A, la recomendada (plantilla):** en la página del repositorio (<https://github.com/JevDev2304/curso-js-ts-api>) pulsa **Use this template → Create a new repository**. Ponle un nombre, déjalo **Public** y créalo. Ahora tienes tu propio repositorio con todos los materiales.

**Opción B (si no ves el botón *Use this template*):** pulsa **Fork** (arriba a la derecha) y crea la copia en tu cuenta. Es lo mismo: queda un repositorio tuyo.

> **No clones directamente el repositorio original** (`git clone` de `JevDev2304/curso-js-ts-api`): no podrías subir tu trabajo a tu GitHub, y necesitas hacerlo (una rama por nivel y, si haces el bonus, Vercel).

#### 5.2 Clónalo en tu computador

Elige una carpeta donde guardarlo (por ejemplo `Documentos`) y ábrela en la terminal:

```bash
cd Documents
git clone https://github.com/TU-USUARIO/NOMBRE-DE-TU-REPO.git
cd NOMBRE-DE-TU-REPO
code .
```

> Aunque tu sistema muestre la carpeta como «Documentos», en la terminal se llama `Documents`. Si `cd Documents` falla, escribe `cd ~` (Mac, Linux o PowerShell) o `cd %USERPROFILE%` (Windows CMD) y vuelve a intentar.

#### 5.3 Instala las dependencias

Dentro de la carpeta del repositorio:

```bash
npm install
```

Verás que se crea una carpeta `node_modules`. Es normal: ahí vive TypeScript. **No la subas ni la borres** (ya está ignorada por Git).

#### 5.4 Verifica todo

```bash
npm run verificar
```

Resultado esperado:

```
✓ Node.js — versión 22.x
✓ npm — versión 10.x
✓ Git — versión 2.x
✓ Git: identidad configurada
✓ Dependencias instaladas — TypeScript 5.9.3
✓ TypeScript compila la Pokédex
✓ Carpetas del curso — completas
✓ API PokéAPI — responde y permite peticiones desde el navegador
✓ API Dragon Ball — responde y permite peticiones desde el navegador
✓ Todo listo para empezar.
```

Las líneas con `!` son avisos opcionales (VS Code, Claude Code). Las que tienen `✗` sí debes arreglarlas: el mismo mensaje te dice cómo. Tu versión de Node, npm y Git puede ser distinta: no importa mientras Node sea 20 o superior.

#### 5.5 Abre los materiales

```bash
npm run servir
```

Abre <http://localhost:5500> en tu navegador. Para detener el servidor, `Ctrl + C` en la terminal.

---

### Paso 6 (opcional): Claude Code

Solo si quieres usar el tutor configurado en este repositorio. Necesitas un plan de pago de Claude (Pro o superior). La instalación y los comandos del tutor están en [`USAR-IA.md`](USAR-IA.md). **No es necesario para hacer el curso.**

---

## Lista de comprobación final

- [ ] `node --version` muestra 20 o superior.
- [ ] `git --version` funciona y configuraste tu nombre y correo.
- [ ] Tienes **tu propia copia** del repositorio (creada con *Use this template* o *Fork*), es **pública**, está en tu computador y abierta en VS Code.
- [ ] `npm install` terminó sin errores.
- [ ] `npm run verificar` termina con «Todo listo para empezar».
- [ ] `npm run servir` abre el menú del curso en el navegador.

¿Algo falló? Ve a [`SOLUCION-PROBLEMAS.md`](SOLUCION-PROBLEMAS.md).
