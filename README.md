# WM TEC · Sistema de clientes

Gestión de clientes, presupuestos, cobros, trabajos, finanzas y tableros de WM TEC.

- Se usa en línea: https://wmezatec.github.io/sistema/ (entrar con la cuenta de Google habilitada).
- Los datos viven en Supabase, no en este repositorio. Solo los correos de la tabla `permitidos` pueden leerlos o guardarlos.
- `supabase/esquema.sql` crea las tablas, permisos y copias diarias.
- `config.js` tiene la URL del proyecto y la clave publicable (son públicas; la seguridad la dan los permisos de la base).
