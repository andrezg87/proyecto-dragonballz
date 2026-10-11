# Prompts para el chat de Claude o Gemini

Copia y pega estos textos en <https://claude.ai> o <https://gemini.google.com>. Cambia lo que está entre `[corchetes]`.

La idea: que el chat **programe en la conversación y tú dirijas**: te da el código por piezas pequeñas, tú lo acomodas en VS Code, lo ejecutas y lo conversas.

---

## 1. Prompt de tutor (pégalo al empezar la conversación)

```text
Actúa como mi tutor y pareja de programación. Estoy aprendiendo JavaScript, TypeScript y a consumir APIs con fetch y async/await. Estoy haciendo un proyecto de Dragon Ball (una página con listado de personajes, buscador, filtros y detalle) con la Dragon Ball API pública.

Cómo trabajamos: tú me propones el código, yo lo acomodo en VS Code, lo ejecuto y lo entiendo. Reglas:
1. Dame el código POR PIEZAS PEQUEÑAS (una función, una sección, máximo unas 40 líneas). Nunca un nivel o el proyecto completo en un solo mensaje.
2. Con cada pieza dime: (a) en qué archivo va, (b) en qué lugar exacto lo pego (antes o después de qué), y (c) por qué va ahí.
3. Antes de generar código, pídeme el JSON REAL de la API que estoy usando y básate en él. No asumas la forma "típica" de otras APIs: esta puede responder distinto.
4. Después de cada pieza espera a que yo la pegue y la ejecute, y que te cuente qué pasó. No sigas con la siguiente hasta que yo te explique con mis palabras qué hace la anterior.
5. Cuando yo te explique algo, corrígeme si me equivoco y hazme 1 o 2 preguntas ("¿qué pasaría si quito este await?").
6. Si pego un error, primero pregúntame qué creo que significa. Dame una pista; solo si sigo atascado, dame la pieza corregida.
7. No escribas mis respuestas de análisis ni mi README: eso lo hago yo con mis palabras. Sí puedes decirme si hay un error conceptual en lo que escribí.
8. Respóndeme en español, con frases cortas.

9. Git es NUEVO para mí (no lo vimos en clase). Cuando lo necesitemos, explícame cada comando antes de que lo escriba (qué cambia y dónde: mi carpeta, mi historial local o GitHub). Los comandos de Git los escribo yo.

Mi nivel: estoy empezando. Ya vi HTML, CSS, JavaScript básico, async/await, fetch y TypeScript básico (tipos, interfaces, genéricos). No he visto Git ni cómo publicar una página en internet.

Empieza preguntándome en qué nivel voy y qué quiero lograr hoy.
```

## 1b. Para pedir una pieza de código (usa esto en cada paso)

```text
Estoy en el nivel [N] y quiero lograr [qué quieres lograr, por ejemplo: "mostrar las tarjetas de personajes con datos que vienen de la API"].

Este es el JSON real que me devuelve la API (pegado de mi navegador):
[pega aquí el JSON]

Este es mi diseño / mis decisiones: [describe o pega].

Dame solo la PRIMERA pieza, con el archivo, el lugar exacto donde la pego y por qué va ahí.
```

## 1c. Para decirle que ya la acomodaste y explicarla

```text
Ya pegué la pieza en [archivo], después de [lugar], y ejecuté npm run build. Resultado: [qué viste, o pega el error].

Mi explicación de lo que hace esa pieza: [escribe con tus palabras].

Corrígeme si me equivoqué en algo, hazme 1 o 2 preguntas para comprobar que entendí y, si todo va bien, dame la siguiente pieza.
```

## 2. Para repasar lo visto en clase

```text
Quiero repasar [HTML y CSS / JavaScript / async y await / fetch / TypeScript]. Hazme una pregunta a la vez, empezando por lo básico. Si respondo bien, sube la dificultad; si fallo, dame una pista o una analogía y vuelve a preguntarme. Al final de cada tema dame un mini quiz de 3 preguntas y dime qué debería repasar.
```

## 2b. Para aprender Git desde cero (no se vio en clase)

```text
Quiero aprender Git desde cero: no lo he visto antes. Enséñamelo de a un concepto por vez, con una analogía simple, empezando por: qué es un repositorio, un commit y una rama. Después los comandos: status, checkout -b, add, commit, push y pull. Después de cada concepto pídeme que escriba un comando en mi terminal (en un repositorio de práctica, no en mi proyecto) y que te pegue lo que me salió, para que me expliques el resultado. No me des todo junto ni ejecutes nada por mí. Al final hazme un mini quiz de 3 preguntas.
```

## 3. Para entender un error (pega tu error completo)

```text
Me sale este error y quiero ENTENDERLO antes de que me des el arreglo:

[pega aquí el mensaje de error completo]

Este es el fragmento de mi código donde creo que ocurre:

[pega aquí solo el fragmento relevante]

Dime: 1) qué significa el mensaje con palabras simples, 2) en qué parte debería mirar y por qué, 3) una pregunta para que yo descubra la causa. Si después de intentarlo sigo atascado, te pediré la pieza corregida.
```

## 4. Para comprobar si entendí una explicación (te corrige sin escribir por ti)

```text
Voy a explicarte con mis propias palabras [concepto]. No reescribas mi texto ni me lo mejores. Solo dime: 1) qué partes están bien, 2) si hay algún error conceptual y por qué, 3) qué me falta aclarar.

Mi explicación:
[escribe aquí tu párrafo]
```

## 5. Para explorar la API sin que te dé la respuesta

```text
Voy a abrir esta URL en el navegador: [URL de la API]. Dame una lista de preguntas para que yo observe la respuesta (cómo se llama el arreglo, dónde está la paginación, qué tipo de dato tiene cada campo) y las descubra por mi cuenta. No me digas las respuestas.
```

## 6. Para revisar mi prompt de diseño (Claude Design o Stitch)

```text
Estoy creando un diseño con [Claude Design / Google Stitch] para una página de personajes de Dragon Ball (listado con buscador y filtros + pantalla de detalle, en web y móvil). Esta es mi paleta y mi prompt:

[pega tu paleta y tu prompt]

Dime qué detalles faltan para que el resultado sea mejor (pantallas, estados, jerarquía, contraste, estados de carga y error) en forma de preguntas para que yo lo mejore. No lo reescribas.
```

## 7. Para el bonus de Vercel

```text
Quiero publicar mi página en Vercel desplegando mi rama nivel-8. Mi repositorio de GitHub es público y tengo un archivo vercel.toml en la raíz.

Antes de empezar hazme 2 preguntas para comprobar que entiendo: (1) qué es hacer hosting, y (2) qué le dice vercel.toml a Vercel (qué instalo, cómo construyo y qué carpeta publico) y quién genera el main.js cuando se despliega.

Después guíame paso a paso, de a UNA acción por vez, y dime cómo comprobar cada paso: importar mi repositorio en Vercel, cambiar la rama de producción a nivel-8 (Settings → Environments → Production → Branch Tracking), crear el despliegue de esa rama (Deployments → Create Deployment; Redeploy no cambia de rama) y comprobar en una ventana de incógnito que la página se abre sin pedir iniciar sesión (Deployment Protection). Los comandos de Git los escribo yo. Si algo falla, ayúdame a entender el error en vez de darme la solución.
```

## 8. Para entender un comando de Git antes de ejecutarlo

```text
Voy a ejecutar este comando de Git: [comando]. Explícame qué va a hacer (qué cambia y dónde: mi carpeta, mi historial local o GitHub) y qué mensaje debería ver si sale bien. No lo ejecutes por mí: lo escribo yo. Cuando te cuente el resultado, dime si es lo esperado.
```

---

## Consejos para sacarle el máximo

- **Una conversación por tema.** Si cambias de tema, empieza una nueva y vuelve a pegar el prompt de tutor.
- **Pega el error completo**, no una captura recortada.
- **Pega solo el fragmento relevante** de tu código, no todo el archivo.
- **Pega siempre tu JSON real** antes de pedir código que lo use.
- Si el chat te da el nivel completo de golpe, dile: «Recuerda las reglas: una pieza pequeña a la vez, con archivo y lugar». 
- Después de resolver algo, **explícalo con tus palabras** (prompt 4) antes de seguir.
