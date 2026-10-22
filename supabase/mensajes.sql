-- Mensajes del formulario de la página web. Pegar en Supabase > SQL Editor > Run (una vez).
-- La página puede escribir (sin leer). Solo los correos permitidos los ven, marcan como leídos o borran.

create table if not exists public.mensajes (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  nombre text not null check (length(nombre) between 1 and 120),
  empresa text check (length(empresa) <= 120),
  telefono text not null check (length(telefono) between 1 and 40),
  tipo text check (length(tipo) <= 80),
  mensaje text not null check (length(mensaje) between 1 and 4000),
  leido boolean not null default false
);

alter table public.mensajes enable row level security;

revoke all on public.mensajes from anon, authenticated;
grant insert (nombre, empresa, telefono, tipo, mensaje) on public.mensajes to anon, authenticated;
grant select, delete on public.mensajes to authenticated;
grant update (leido) on public.mensajes to authenticated;

drop policy if exists "enviar" on public.mensajes;
drop policy if exists "leer" on public.mensajes;
drop policy if exists "marcar" on public.mensajes;
drop policy if exists "borrar" on public.mensajes;
create policy "enviar" on public.mensajes for insert to anon, authenticated with check (leido = false);
create policy "leer" on public.mensajes for select to authenticated using (public.es_permitido());
create policy "marcar" on public.mensajes for update to authenticated using (public.es_permitido()) with check (public.es_permitido());
create policy "borrar" on public.mensajes for delete to authenticated using (public.es_permitido());
