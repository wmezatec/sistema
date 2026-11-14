# Manual de marca · WM TEC

Este manual sirve para que cualquier persona pueda mantener, ampliar o rehacer el sistema y los materiales de WM TEC sin perder cómo se ven, cómo hablan y qué se quiere y qué no.

Actualizado el 13/11/2026.

---

## 1. Quién es WM TEC

- **Qué hace:** mantenimiento eléctrico industrial y comercial. Se ocupa de tableros, cámaras de frío, máquinas, instalaciones, reparaciones, diagnósticos de tablero, trabajos domiciliarios y contratos de mantenimiento.
- **Quién está detrás:** Walter Martín Meza, electricista. La firma de los documentos es suya.
- **Dónde trabaja:** Mar del Plata y zona.
- **Contacto que figura en los documentos:** teléfono 223 531 3019, Instagram @wmeza.tec, Pringles 2565.
- **Clientes típicos:** frigoríficos, hoteles, consorcios, comercios, estudios de arquitectura y particulares. Muchos llegan por recomendación, por WhatsApp, por Instagram o por la página web.
- **Página web:** https://wmezatec.github.io/
- **Sistema:** https://wmezatec.github.io/sistema/ (se entra con una cuenta de Google habilitada).

**Personalidad:** técnico serio, prolijo y de confianza. Habla claro, sin vueltas y sin palabras de más. Trabaja en la calle, con el celular en la mano, así que todo tiene que ser rápido de leer y de usar.

---

## 2. Logo

Los archivos están en la carpeta `logo/`:

| Archivo | Uso |
|---|---|
| `wmtec-logo-oscuro.svg` | Logo completo: la W y la M en zigzag, con "TEC" abajo en blanco cálido. Va sobre fondo carbón (menú lateral, pantalla de acceso, encabezado del presupuesto). |
| `wmtec-isotipo.svg` | Solo el zigzag. Es el ícono de la pestaña y del menú contraído. |
| `icono-192.png` / `icono-512.png` | Íconos de la app instalada en el celular. |
| `aviso-insignia.png` | Insignia de las notificaciones de Chrome. |

**El símbolo:** un zigzag continuo de 7 trazos que forma "WM", como una línea de tensión. Los trazos alternan dos degradados verticales:
- **Amarillo:** de `#FFD54F` a `#FFB300`.
- **Naranja:** de `#F9A01B` a `#E07B00`.

**Reglas:**
- No cambiarle los colores ni ponerle sombras o contornos.
- No estirarlo ni deformarlo.
- Sobre fondo claro, usar el isotipo solo. El logo completo tiene "TEC" en blanco cálido (`#F7F7F3`), así que va siempre sobre carbón. No hay versión del logo completo para fondo claro: si hace falta, se arma copiando el SVG y cambiando el color de "TEC" a carbón (`#232323`).

---

## 3. Colores

Están definidos como variables en `index.html` (`:root`). Si se rehace el sistema, conviene copiar estas variables tal cual.

| Nombre | Código | Para qué se usa |
|---|---|---|
| Carbón | `#232323` | Menú lateral, pantalla de acceso, botones oscuros, fondo del logo. |
| Carbón 2 | `#2e2e2e` | Variante del carbón para capas. |
| Chapa | `#e3e4df` | Fondo general de la app (gris cálido, como chapa). |
| Papel | `#f7f7f3` | Fondo de las tarjetas y texto claro sobre carbón. |
| Tinta | `#1f201d` | Texto principal. |
| Tinta suave | `#55574f` | Fechas, autores, textos secundarios. |
| Naranja | `#f9a01b` | Color de la marca: foco, ítem activo del menú, acentos. |
| Naranja oscuro | `#e07b00` | Final del degradado. |
| Degradado | `#ffc107 → #f9a01b → #e07b00` | Botón principal y barra de scroll. |
| Verde | `#277a41` | Hecho, cobrado, bien. |
| Ámbar | `#d99a13` | Para este mes, atención. |
| Rojo | `#c23b2c` | Urgente, vencido, borrar. |
| Azul | `#3a6ea5` | Trabajos en la línea de tiempo. |
| Gris | `#8b8d85` | No medido, neutro. |
| Verde WhatsApp | `#3be37a → #1fb556` | Solo el botón de WhatsApp y el de "Aceptado". |

**Semáforo del diagnóstico:** Bien (verde), Este mes (ámbar), Urgente (rojo), No medido (gris).

---

## 4. Tipografía

- **Fuente única:** **Archivo** (Google Fonts, variable en ancho y peso: `wdth 62..125`, `wght 300..900`). Si no carga, se usa la del sistema.
- **Títulos (h1, h2, h3):** peso 800, ancho condensado (`wdth 85`), interlineado 1.1 y letras apenas juntas (`-0.01em`). Tamaños: h1 1.65rem, h2 1.25rem, h3 1rem.
- **Texto:** 1rem, interlineado 1.45.
- **Botones y menú:** peso 600 a 700.
- No se usan otras fuentes ni más de una familia.

---

## 5. Formas, sombras y detalles

- **Botones:** píldora, totalmente redondeados (`999px`).
- **Tarjetas:** 20 px de radio, borde fino `#c9cbc4` y una franja gris de 4 px arriba (las tarjetas con "barra").
- **Campos de texto:** 14 px de radio, fondo `#e7e8e2`, sin borde, con una **sombra hacia adentro** (`inset 2px 2px 4px rgba(0,0,0,.22)`). Se ven como hundidos en la chapa. Al escribir, se ponen blancos con un contorno naranja.
- **Foco del teclado:** contorno naranja de 3 px.
- **Barra de scroll:** fondo carbón y barra con el degradado naranja.
- **Íconos:** de línea, trazo 1.8, puntas redondeadas, 21 px. Se dibujan como símbolos SVG dentro de `index.html` (ejemplos: `i-cal`, `i-trab`, `i-bita`, `i-lapiz`). Nada de emojis en la interfaz.
- **Volver y mes:** flechas en piquito (chevron), no flechas comunes.
- **Editar:** siempre con el lapicito.

---

## 6. Componentes de la interfaz

### Menú lateral
- Fondo carbón, con el logo arriba y un botón para contraerlo.
- **Orden:** Hoy, Clientes, Presupuestos, Trabajos, Agenda, Bitácora y Más. Dentro de Más: Cobros, Mensajes, Precios, Diagnósticos, Finanzas, Tableros, Colaboradores y Feedback.
- **Abajo:** Página web, el estado de guardado, Configuración y la campanita de Notificaciones.
- **Ítem activo:** fondo un poco más claro y una raya naranja a la izquierda.
- **Contadores:** a la derecha de cada ítem. Se ponen en alerta cuando hay algo vencido.
- Tiene que entrar en la pantalla sin scroll.

### Barra de arriba
- Lleva el título de cada pantalla, grande y subrayado.
- Los botones de la pantalla (volver, acciones, datos en pastillas) van en esa barra, no repetidos abajo.

### Botones
| Tipo | Aspecto | Uso |
|---|---|---|
| Principal | Degradado naranja, texto carbón | La acción principal: "+ Añadir", "Ver documento". |
| Oscuro | Degradado gris oscuro, texto blanco | Acciones comunes. |
| Claro | Blanco con borde fino | Acciones secundarias y botones de ícono. |
| WhatsApp / Aceptado | Verde | Escribir por WhatsApp y marcar un presupuesto como aceptado. |
| Peligro | Blanco con borde y texto rojo | Borrar, quitar, rechazado. Siempre pide confirmación. |

### Tarjetas y listas
- Cada bloque es una tarjeta "barra" con título h2.
- Las filas de una lista se separan con líneas finas, no con cajas dobles.
- **Historial de clientes:** línea de tiempo con puntos de color (presupuesto naranja, trabajo azul, cobro verde, diagnóstico violeta).
- Descripciones de dos renglones como máximo en las listas.

### Celular
- Menú ☰ y encabezado en dos filas.
- Las tablas se convierten en tarjetas.
- Diálogos con X para cerrar.
- Buscador y filtro uno debajo del otro, a todo el ancho.
- Micrófono flotante.

---

## 7. Campos de texto: qué se quiere y qué no

Este es el punto más importante para quien siga el sistema.

### Lo que SÍ
- **Título arriba del campo** (label) que diga qué va, en pocas palabras: "Fecha", "Cliente", "Qué se hizo".
- **Formato en vivo:** `**negrita**`, `*cursiva*`, `++subrayado++`, `## título`, `- lista` y `- [ ] tarea`. Las marcas se ocultan mientras se escribe y queda el texto con formato.
- **Barra de formato** arriba de los textos largos, con los botones B, I, S, H, • y ☐.
- **Micrófono** en los buscadores y en las áreas de texto, para dictar.
- **Mayúscula automática** al empezar cada oración. Se puede apagar en Configuración → Textos.
- **Montos y porcentajes:** los montos se escriben con signo y puntos de miles (`$ 160.000`), y los porcentajes con `%`.
- **Fechas:** `dd/mm/aaaa` en las listas. En títulos, el día con nombre ("Jueves 13 de noviembre").
- **Autoguardado** en las notas: lo que se escribe se guarda solo.
- **Campos generosos:** los textos largos tienen buen alto. El de la Bitácora mide 304 px (4 veces el normal), y los de materiales crecen solos a medida que se escribe.
- **Atajos:** Enter en un material crea el siguiente, pegar una lista la reparte en renglones y Ctrl + Enter añade en la Bitácora. Funcionan, pero no se anuncian en pantalla.

### Lo que NO
- **Nada de aclaraciones dentro de los campos.** No se usan textos de ejemplo grises (placeholder) como "Elegí o escribí un cliente", "Hoy instalamos…", "Buscar", "$", "Ej. 60 %" ni "Arquitecta, administrador…". Se sacaron de todo el sistema el 13/11/2026 y no se vuelven a poner.
- **Nada de carteles de ayuda** del estilo "Ctrl + Enter también añade".
- **Nada de aclaraciones redundantes** en las etiquetas. Por ejemplo, la etapa se llamaba "Cliente (ganado)" y quedó "Cliente", sola.
- **Nada de datos de ejemplo** cargados en el sistema real.
- **Nada de campos chicos** para textos largos.

---

## 8. Cómo comunica (voz y tono)

- **Español rioplatense con voseo:** "Elegí", "Tildá", "Escribí", "Cargá", "Llamalo".
- **Frases cortas y concretas,** como las diría Walter: "Hoy instalamos el tablero", "Avanzamos con la cámara 2".
- **Nombres de pantallas y botones** de una o dos palabras: Hoy, Clientes, Agenda, Bitácora, Anotar, Hecho, Aceptado, Quitar.
- **Sin tecnicismos de computación:** se dice "Se guarda solo", no "Sincronizando con la base de datos".
- **Avisos en una línea:** "Escribí qué se hizo", "Falta el nombre del cliente".
- **Para borrar se pregunta siempre:** "¿Quitar esta entrada de la bitácora?".
- **Con el cliente** (presupuestos, encuesta, WhatsApp): formal pero cercano, prolijo y sin errores. Firma Walter Martín Meza · WM TEC · Mantenimiento eléctrico industrial · Mar del Plata y zona.

---

## 9. Documentos (presupuesto en A4)

- **Hoja y encabezado:** hoja A4 con membrete: logo, Walter Martín Meza, dirección, teléfono e Instagram.
- **Barras del membrete:** van arriba y abajo de cada hoja, en el margen, sin tapar renglones.
- **Varias hojas:** con "Página X de Y".
- **Numeración:** `WM-001`, `WM-002`… Si se cambia el número a mano, el siguiente sigue desde ese.
- **Partes del presupuesto:** renglones de trabajo con importe, Materiales (apartado propio, importe opcional), Nota, Condiciones (de una biblioteca, se tildan las que van), descuento y descuento por efectivo.
- **Combustible:** cada presupuesto nuevo trae "Combustible y traslado" por $ 20.000.
- **Ficha privada:** valor caja, módulos y cómo se cotizó. **No sale en el PDF.**
- **Precios de referencia:** guía AAIERIC de mano de obra.

---

## 10. Bitácora y Feedback

- **Bitácora:** el diario de trabajo. Al terminar el día se anota qué se hizo ("hoy instalamos esto, avanzamos con aquello").
  - El cliente es opcional. Si se escribe uno que no existe, se ofrece agregarlo como cliente nuevo.
  - Tiene el mismo formato que las notas.
  - Se ve en una sola página con scroll, separada por días ("Hoy", "Ayer", y después la fecha), con el día más reciente arriba.
- **Feedback:** está debajo de Colaboradores. Ahí se anota qué anda bien, qué cambiar y qué falta del sistema. La fecha se pone sola.
- **Dónde está lo anotado:** el contenido de las dos vive en Supabase (tabla `datos`), no en este repositorio. Para revisarlo, entrar al sistema o exportar desde Supabase. Este manual no lo copia.

---

## 11. Qué hace cada pantalla

| Pantalla | Qué hace |
|---|---|
| **Hoy** | Lo del día en tres columnas: Atrasado, Hoy y Pendiente. Botones "+ Trabajo" y "Cobro". Cada fila tiene WhatsApp, Llamar y Hecho como íconos. |
| **Clientes** | Lista con buscador y filtro. La ficha tiene pestañas Trabajos, Datos (editable), Seguimiento e Historial (línea de tiempo con autor). Etapas: Consulta nueva, Visita agendada, Diagnóstico hecho, Presupuesto enviado, Cliente, Perdido. |
| **Presupuestos** | Ver la sección 9. Estados: Borrador, Enviado, Aceptado, Rechazado. Al marcarlo Aceptado pregunta cómo se cobra (50 % de anticipo y 50 % al terminar, o un solo pago) y arma los cobros con sus fechas. |
| **Trabajos** | Órdenes de trabajo (O.T.) con pasos en cuadrícula: pedido, visita de obra, presupuesto, trabajo y remito, cobro y cierre. Clic izquierdo marca hecho (tilde verde); clic derecho, "no lleva" (X roja). Tienen fotos y videos (Supabase Storage), notas que se guardan solas, remito y la encuesta de conformidad. Tipos: Reparación, Instalación, Falla de máquina, Domiciliario, Diagnóstico de tablero, Mantenimiento, Otro. |
| **Agenda** | Mes con íconos por tipo (contacto, trabajo, mantenimiento, cobro, presupuesto, gasto fijo) y el clima de Mar del Plata (Open-Meteo). Tocar un día abre el detalle a la derecha. |
| **Bitácora** | Diario de trabajo (sección 10). |
| **Cobros** | Lo que hay que cobrar, con los vencidos en rojo. Al anotar o terminar un trabajo sin presupuesto, el sistema pregunta cuándo se cobra: en una fecha, ya cobrado, sin fecha (lo recuerda en una semana) o con presupuesto. |
| **Mensajes** | Lo que llega del formulario de la página web (tabla `mensajes`). Solo aparece si la tabla existe. |
| **Precios** | Lista de precios, con la guía AAIERIC de mano de obra cargada. |
| **Diagnósticos** | Lista de control del tablero con el semáforo (Bien, Este mes, Urgente, No medido), qué se encontró, qué hay que hacer y fotos. Arma un informe para el cliente. |
| **Finanzas** | Movimientos (ingresos y gastos), gastos fijos y saldo. |
| **Tableros** | Editor de esquemas de tableros (unifilar y frente), basado en OneLineEditor (ver `tableros/THIRD_PARTY_NOTICES.md` y la licencia). Exporta a imagen e imprime. |
| **Colaboradores** | Quien trae trabajo (arquitectos, administradores, empresas) y cuánto facturaron sus clientes. |
| **Feedback** | Ideas y cambios para el sistema (sección 10). |
| **Notificaciones** | La campanita junta todos los avisos. Con los avisos de Chrome activados, avisa cobros, actividades y trabajos del día mientras el sistema está abierto. |
| **Configuración** | Vista (Esencial o Completa), Textos (mayúscula automática), Mi usuario, Usuarios con acceso, Combustible y traslado, Numeración de presupuestos, Avisos, Copias y datos (descargar copia .json, restaurar copia, cartera a Excel .csv) y Cerrar sesión. |

**Vista Esencial:** oculta Diagnósticos, Finanzas, Tableros, Colaboradores y Feedback (los ítems marcados `solo-completa`). **Completa** muestra todo.

**Funciones que atraviesan todo el sistema:**
- **Micrófono en el buscador:** entiende frases. Ejemplos: "cliente nuevo Juan Pérez", "gasté 20 mil en cables", "cobré 150 mil a…", "trabajo para… mañana", "llamar a… el jueves", "nota para…".
- **Deshacer y rehacer:** Ctrl + Z y Ctrl + Y (o Ctrl + Shift + Z), fuera de los campos de texto.
- **Encuesta de conformidad:** `encuesta.html`. Es el último paso de la O.T. Se manda el link por WhatsApp; el cliente contesta 5 preguntas y la respuesta queda en el historial.
- **Autor:** cada nota guarda quién la escribió, según la cuenta de Google.

---

## 12. Instalar el sistema desde cero

Para levantarlo en una cuenta nueva, en este orden:

1. **Supabase:** crear un proyecto. En *SQL Editor*, correr los archivos de `supabase/` en este orden: `esquema.sql`, `version.sql`, `usuarios.sql`, `archivos.sql`, `encuestas.sql` y `mensajes.sql`.
2. **Primer usuario:** en *Table Editor → permitidos*, agregar a mano el primer correo de Google, en minúsculas. Después se suman los demás desde Configuración → Usuarios con acceso.
3. **Google:** en Google Cloud, crear un cliente OAuth (aplicación web). En Supabase, *Authentication → Providers → Google*, pegar el ID y el secreto. En *URL Configuration*, agregar la dirección del sistema (por ejemplo `https://wmezatec.github.io/sistema/`) y `http://localhost:8787`. Mientras la app de Google esté en modo prueba, cada correo tiene que estar también como usuario de prueba en Google Cloud.
4. **`config.js`:** poner la URL del proyecto y la clave publicable (*Project Settings → API*). Es pública por diseño: la seguridad la dan los permisos de la base.
5. **GitHub Pages:** subir el repositorio y activar Pages desde la rama `main`. La página web de WM TEC escribe en la tabla `mensajes` con la misma URL y clave.
6. **Probar:** entrar con el correo habilitado, cargar algo, recargar y ver que siga ahí.

**Copias de seguridad:**
- La base guarda sola una copia por día en la tabla `copias` y conserva 60 días.
- Desde Configuración se puede descargar una copia `.json` y restaurarla. Conviene descargarla una vez por mes y guardarla fuera de Supabase.
- El código de toda la app está en GitHub. Los datos, no: están solo en Supabase y en esas copias.

**Uso local, sin Supabase:** `iniciar.bat` (necesita Node.js) abre http://localhost:8787 y guarda en `datos/datos.json`. Lo cargado ahí no se mezcla con lo de la nube.

---

## 13. Otros archivos del repositorio

| Archivo | Qué es |
|---|---|
| `cambios.md` | Registro de cambios por sesión. |
| `pendientes.md` | Lo que está hecho y lo que falta (por ejemplo, avisos con el sistema cerrado). |
| `eventos-relaciones-publicas.md` | Eventos de la zona para hacer relaciones públicas (industria, construcción, agro). |
| `manual-de-marca.md` / `.pdf` | Este manual. |
| `manual/plantilla.html` y `manual/armar.py` | La fuente del PDF. Se cambia el texto en `plantilla.html` y se corre `python manual/armar.py` (necesita Python y Chrome) para generar de nuevo `manual-de-marca.pdf`. |

---

## 14. Cómo replicar el sistema

- **Todo en un archivo:** `index.html` (HTML, estilos y JavaScript, sin frameworks).
- **Datos:** Supabase, con la URL y la clave publicable en `config.js`. Los pasos para instalarlo están en la sección 12.
- **Acceso:** con Google.
- **Uso sin internet:** `iniciar.bat` levanta `server.js` en http://localhost:8787 y guarda los datos en `datos/datos.json`.
- **App en el celular:** `manifest.webmanifest` y `sw.js`.
- **Publicación:** GitHub Pages, repositorio `wmezatec/sistema`.
- **Clima de la agenda:** Open-Meteo.
- **Historial de cambios:** `cambios.md`. **Lo que falta hacer:** `pendientes.md`.

**Reglas para seguirlo:**
1. Usar los mismos colores, la misma fuente y los mismos radios.
2. Seguir con un solo archivo y código simple.
3. Probar siempre en el celular.
4. Escribir los textos con voseo y cortos.
5. No volver a poner aclaraciones dentro de los campos.
6. Hacer un commit por cambio, con un mensaje en castellano que diga qué cambió ("Celular: menú ☰, encabezado en dos filas y diálogos con X").
