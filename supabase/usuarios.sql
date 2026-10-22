-- Usuarios: administrar los correos con acceso desde Configuración. Pegar en Supabase > SQL Editor > Run (una vez).
-- Cualquier usuario habilitado puede sumar o quitar correos (no a sí mismo) y cambiar solo su propio nombre.

alter table public.permitidos add column if not exists nombre text check (length(nombre) <= 60);

grant select, insert, delete on public.permitidos to authenticated;
grant update (nombre) on public.permitidos to authenticated;

drop policy if exists "ver usuarios" on public.permitidos;
drop policy if exists "sumar usuarios" on public.permitidos;
drop policy if exists "quitar usuarios" on public.permitidos;
drop policy if exists "mi nombre" on public.permitidos;
create policy "ver usuarios" on public.permitidos for select to authenticated using (public.es_permitido());
create policy "sumar usuarios" on public.permitidos for insert to authenticated with check (public.es_permitido() and email = lower(email) and email like '%_@_%._%');
create policy "quitar usuarios" on public.permitidos for delete to authenticated using (public.es_permitido() and email <> lower(auth.jwt() ->> 'email'));
create policy "mi nombre" on public.permitidos for update to authenticated using (email = lower(auth.jwt() ->> 'email')) with check (email = lower(auth.jwt() ->> 'email'));
