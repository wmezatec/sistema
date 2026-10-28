# Registro de cambios

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
- **Requiere** ejecutar en el SQL Editor la columna `version` y el trigger. Mientras no esté, la app carga y guarda como antes, sin control de versión.

## Pendientes
Ver `pendientes.md`.
