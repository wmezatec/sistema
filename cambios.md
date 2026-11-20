# Registro de cambios

## 19 y 20/11/2026
- **Proyectos** (Más → Proyectos y botón Crear): estimación global con Tarea, Material, Proveedor, Cotización, Costo y Notas. Total Proyecto suma la Cotización. Documento A4 con la columna Costo siempre visible. El cliente se busca escribiendo y cada proyecto nuevo queda en la Bitácora y en el historial del cliente.
- **Clientes:** al escribir en la lista, el cursor pasa al buscador, ordena por coincidencia y Backspace borra todo.
- **Ficha del cliente:** datos fijos a la izquierda, cuatro cifras (saldo, facturado, lo próximo, presupuestos esperando), botón + Nuevo, Enviar mensaje y pestañas Resumen, Trabajos y presupuestos, Cobros, Proyectos y Técnico (solo las que tienen datos).
- **Clic secundario** en las filas de Presupuestos, Clientes y Proyectos: Ver, Editar, Borrar, con el estilo de marca.
- **Presupuesto:** campo Trabajo editable (con sugerencias de tipos).
- **Celular:** documento A4 sin cortarse; encabezado en una sola línea con menú ⋮.
- **Impresión:** franja amarilla arriba y abajo como parte del documento (nunca tapa texto), esquinas redondeadas y el contenido más pegado arriba.
- Se unió con los cambios del 17/11 de GitHub (presupuestos desde el N° 36, importes compactos).

Cambios hechos en la sesión del 28 al 29/10/2026. Todo está en `index.html`, salvo lo que se indica.

## Commits de esta sesión
- `1745aa3`: interfaz (encabezados en barra, presupuestos, agenda).
- `ff355ef`: agenda con clima, feedback del sistema y ajustes del menú.
- `9a5f082`: guardado con control de versión en Supabase.
- `7e4f591`: acceso que carga los datos aunque falte la columna `version`.

## Presupuestos
- Presupuesto en A4 que se imprime en varias hojas, con márgenes, barras repetidas arriba y abajo, y "Página X de Y".
- Ficha privada por presupuesto (valor caja, módulos, cómo se cotizó, otras referencias). No sale en el PDF.
- Apartado de Materiales, con importe opcional y tilde para sumarlo al total.
- Biblioteca de condiciones: se guardan, se editan, se eliminan, y cada presupuesto tilda las que usa.
- Descuento y descuento por efectivo con el signo %.
- Al cambiar el N° a mano, el contador toma ese número (si ponés WM-036, el siguiente es WM-037).
- Botones de la barra: Aceptado en verde, Rechazado en rojo, Imprimir en carbón a la derecha de Rechazado.

## Órdenes de trabajo
- Pasos en cuadrícula. Clic izquierdo marca hecho (tilde verde), clic derecho marca "no lleva" (X roja).
- Encabezado en la barra de arriba, con botón de volver y datos en pastillas.
- Notas autoguardadas: un solo bloc por orden, y las notas viejas quedan abajo.
- Descripciones con dos renglones máximo en las listas.

## Clientes
- Encabezado en la barra. Buscador y filtro de clientes en la barra, en lugar del buscador general y de Crear, solo en esta pantalla.
- Pestañas Trabajos / Datos / Seguimiento / Historial con aspecto de botón. Las secciones de Trabajos van en columnas.
- Tabla más angosta en la vista chica.

## Agenda y Hoy
- Encabezado "Agenda" en la barra. Lista de meses al tocar el nombre del mes, con flechas.
- Tocar un día abre el desglose a la derecha. El botón "+ Agregar" es más grande.
- Clima de Mar del Plata en cada día (íconos de línea y % de lluvia), con Open-Meteo.
- Hoy: secciones Atrasado, Hoy y Pendiente en columnas.

## Menú lateral y barra de arriba
- Orden: Hoy, Clientes, Presupuestos, Trabajos, Agenda, Más. Página web encima del cuadro de guardado.
- Campanita de Notificaciones debajo de Configuración, con todos los avisos juntos.
- Menú más compacto para que no aparezca el scroll.
- Título de cada pantalla en la barra, más grande y subrayado.

## Textos y montos
- Negrita, cursiva y subrayado en vivo en las áreas de texto (`**negrita**`, `*cursiva*`, `++subrayado++`). Las marcas se ocultan.
- Mayúscula al empezar cada oración (se apaga en Configuración → Textos).
- Montos con `$ 160.000` y porcentajes con `%`.
- Micrófono en todos los campos de búsqueda y en las áreas de texto.

## Configuración
- Sección Vista (Esencial / Completa).
- Sección Textos (mayúsculas).

## Otros
- Pestaña Feedback debajo de Colaboradores, para anotar cambios del sistema (la fecha se pone sola).
- Deshacer (Ctrl+Z) y rehacer (Ctrl+Y / Ctrl+Shift+Z) fuera de los campos de texto.
- Lapicito en los botones de Editar y flechas en piquito en los botones de volver y de mes.

## Supabase
- La app guarda todo el sistema en la fila `datos` de la tabla `datos`, y las encuestas, mensajes, usuarios y archivos en sus tablas y bucket.
- Control de versión: la app guarda solo si la versión de la fila no cambió desde la última carga. Si cambió, avisa y no pisa nada.
- **Requiere** correr `supabase/version.sql` en el SQL Editor. Mientras no esté, la app carga y guarda como antes, sin control de versión.

## Sesión del 05/11/2026
- `90a92fc`: celular con menú ☰, encabezado en dos filas y diálogos con X.
- `5693548`: celular con agenda de celdas iguales, tarjetas de órdenes y menú sin duplicados.
- `665be77`: impresión con las barras del membrete en el margen de la hoja, sin tapar renglones.

## Sesión del 13/11/2026
- Bitácora diaria en el menú, debajo de Agenda: fecha, cliente opcional (ofrece agregarlo como cliente nuevo) y texto con formato. Historial en una sola página separado por días. Campo de texto de 304 px de alto.
- Se sacaron todas las aclaraciones de los campos de texto (placeholders) y el cartel "Ctrl + Enter también añade".
- Presupuesto: Enter en un material crea el siguiente, pegar una lista la reparte y los cuadros crecen solos.
- Manual de marca en `manual-de-marca.md` y `manual-de-marca.pdf`.
- `supabase/version.sql`: el SQL de la columna `version` y su disparador, que antes no estaba en el repositorio.

## Pendientes
Ver `pendientes.md`.
