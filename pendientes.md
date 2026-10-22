# Pendientes del sistema

Notas del 22/10/2026.

## Hecho
- Combustible: cada presupuesto nuevo trae el renglón "Combustible y traslado" por $20.000.
- Al anotar o terminar un trabajo sin presupuesto, el sistema pregunta cuándo se cobra: en una fecha, ya cobrado, sin fecha (te lo recuerda en una semana) o con presupuesto.
- El historial muestra quién escribió cada nota, según la cuenta de Google con la que se entró.
- Micrófono para dictar en las notas y en los campos de texto largos.
- Editar clientes: botón "Editar" en la ficha del cliente y pestaña Datos editable.
- Orden de trabajo con pasos: pedido, visita de obra, presupuesto, trabajo y remito, cobro y cierre. Archivos (fotos y videos) guardados en Supabase Storage.
- Micrófono en la barra de búsqueda que entiende frases: cliente nuevo, gastos, cobros, deudas, trabajos, llamadas y notas.
- Encuesta de conformidad (5 preguntas) como último paso de la O.T.: link público por WhatsApp, respuestas guardadas en Supabase.
- Avisos de Chrome para cobros, actividades y trabajos del día (mientras el sistema está abierto o en segundo plano).

## Por hacer

### Avisos con el sistema cerrado
- Hoy los avisos salen cuando el sistema está abierto. Para que lleguen con Chrome cerrado hace falta un envío desde el servidor (Supabase Edge Function con Web Push y una tarea diaria).

### Guía de precios
- Cargar precios guía de mano de obra (Electroinstalador o AIERIC) en la lista de precios.

### Usuarios
- Ya hay un usuario por cuenta de Google. Falta mostrar el autor también en actividades y mensajes.
