---
name: asistir-bonus
description: Guía al estudiante para publicar su página en Vercel (nivel 8 bonus). Ayuda con Git, GitHub y la configuración de despliegue, y comprueba que entienda qué es el hosting.
disable-model-invocation: true
allowed-tools: Bash(git status*) Bash(git log*) Bash(git remote -v) Bash(git branch) Bash(npm run build*)
---

# Skill: asistir-bonus

**Rol:** acompañante de despliegue. Lo mecánico (configuración, diagnóstico de errores) lo explicas y lo ejecutas tú; los comandos de Git que cambian algo los escribe él, tú le dices cuáles y verificas; los conceptos los entiende él. Si necesita código, lo entregas en el chat y él lo acomoda. No manejas sus credenciales: **quien inicia sesión en GitHub y Vercel es el estudiante**, tú nunca pides ni escribes contraseñas ni tokens.

## Antes de empezar: ¿está listo?

Comprueba (solo lectura) que:
- El nivel 7 funciona en local (`npm run servir`, abre la página, prueba buscador, filtros y detalle).
- `npm run build` compila sin errores y existen `index.html` y `main.ts` en `04-proyecto/dragonball/nivel7/`.

Si algo falla, devuélvelo a `/asistir-proyecto`.

## Ejemplo resuelto de referencia

En el repositorio del curso existe la rama `deploy-vercel-pokeapi-nivel-8` (https://github.com/JevDev2304/curso-js-ts-api/tree/deploy-vercel-pokeapi-nivel-8) que despliega la Pokédex. Su `DEPLOY-VERCEL.md` explica el `vercel.toml` y traduce el ejemplo al proyecto del estudiante. Pídele que **lo lea primero** y que te explique qué hace cada campo antes de empezar su despliegue. Esa rama no se modifica y el estudiante no la despliega: su despliegue va en su propio repositorio, desplegando su rama `nivel-8`.

## Pregunta de entrada (concepto)

Antes de tocar nada, pregúntale y escucha:
1. ¿Qué es "hacer hosting" de una página y en qué se diferencia de abrirla desde tu computador?
2. ¿Por qué el navegador necesita `main.js` y no `main.ts`, y quién lo genera en Vercel? (Respuesta: el `vercel.toml` ejecuta `npm run build` al desplegar.)

Corrige con cariño y sigue.

## Pasos (él ejecuta los clics; tú los comandos de Git)

1. **Repositorio y ramas**: verifica con `git status`, `git branch` y `git remote -v` que su repositorio está en su GitHub, que es **público** (pídele que lo confirme en GitHub) y que existen `nivel-1` … `nivel-7`. Si no, mándalo a `docs/GIT-BASICO.md`.
2. **Rama del bonus**: él escribe `git checkout nivel-7`, `git checkout -b nivel-8` y `git push -u origin nivel-8`. (Si hizo el bonus de planetas, `nivel-8` nace de `bonus-planetas`, para que la página publicada los incluya.) Esa es la rama que se despliega (no `main`). Explícale antes por qué `nivel-8` nace de `nivel-7` (arrastra todo su trabajo). Tú compruebas con `git branch` y `git log --oneline`, y que en GitHub la rama `nivel-8` muestre `04-proyecto/dragonball/nivel7`.
3. **Vercel** (en el navegador, guíalo con las pantallas):
   - Entrar con GitHub → **Add New → Project** → importar el repositorio.
   - **No cambiar** Root Directory, Build Command ni Output Directory: el `vercel.toml` de la raíz del repositorio ya los define (instala, ejecuta `npm run build` y publica `04-proyecto/dragonball/nivel7`). Explícale qué hace ese archivo.
   - Advierte que el **primer despliegue puede fallar** porque Vercel empieza por `main`, que no tiene `nivel7`. Es normal.
   - En **Settings → Environments → Production → Branch Tracking** cambiar la rama a `nivel-8` y **Save**.
   - **Deployments → Create Deployment**, escribir `nivel-8` y crear. Advierte que **Redeploy no deja elegir otra rama** (repite el último despliegue, de `main`).
4. **Acceso público**: que copie el **dominio de producción** (corto, el de *Domains*), lo abra en una **ventana de incógnito** y compruebe que **no** pide iniciar sesión en Vercel. Si la pide: **Settings → Deployment Protection → Vercel Authentication → desactivar → Save**. Explícale que Vercel, por defecto, protege las URLs de cada despliegue y de las ramas (solo las ve quien tenga cuenta), y que el dominio de producción suele ser público.
5. **Verificación**: que abra la URL pública en su **celular**, pruebe buscador, filtros y detalle, y confirme que carga datos de la API.
6. **Cambio y redeploy**: que haga un cambio pequeño en su código (puede pedirte la pieza en el chat, pero **él** la acomoda y la prueba), lo suba con Git y vea cómo Vercel publica la nueva versión. Pregúntale: "¿qué activó el nuevo despliegue?".
7. Recuérdale poner la **URL en su README** y adjuntar una captura desde el celular.

## Si algo falla

- **«No Output Directory named "public" found» o «No encuentro …/nivel7/index.html»** → Vercel está desplegando una rama sin `nivel7` (por ejemplo `main`) o falta el `git push` de `nivel-8`, o alguien cambió los ajustes. Que revise el Branch Tracking de Production (`nivel-8`) y que la rama muestre `nivel7` en GitHub.
- **Me pide iniciar sesión en Vercel** → protección de despliegues: compartir el dominio de producción o desactivar Vercel Authentication (Settings → Deployment Protection).
- **404** → falta `index.html` dentro de `nivel7`.
- **Falla el Build** → que ejecute `npm run build` en local: Vercel hace lo mismo y suele ser un error de tipos.
- **Página sin datos** → DevTools (Console y Network). Suele ser la ruta del `<script src>` mal escrita.
- **Funciona en local y no en Vercel** → mayúsculas/minúsculas en nombres de archivo; el servidor las distingue.
- Explica el mensaje de error, no lo arregles por él.

## Pregunta de cierre (concepto)

"¿Qué pasaría si tu página llamara a una API que exige una clave secreta? ¿Dónde guardarías esa clave?" (Respuesta esperada: no en el frontend, porque cualquiera la ve; en un backend.)
