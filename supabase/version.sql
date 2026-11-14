-- Control de versión del guardado. Pegar en Supabase > SQL Editor > Run (una vez, después de esquema.sql).
-- Cada guardado sube "version" en 1. La app guarda solo si la versión no cambió desde que cargó los datos:
-- si otro lugar (otra computadora, el celular) guardó antes, avisa y no pisa nada.
-- Se puede volver a correr sin problema.

alter table public.datos add column if not exists version bigint not null default 1;

-- Mismo disparador de esquema.sql (fecha, autor y copia del día), ahora sumando la versión
create or replace function public.antes_de_guardar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.actualizado := now();
  new.actualizado_por := auth.jwt() ->> 'email';
  new.version := coalesce(old.version, 0) + 1;
  if old.contenido <> '{}'::jsonb then
    insert into public.copias (fecha, contenido) values (current_date, old.contenido) on conflict (fecha) do nothing;
    delete from public.copias where fecha < current_date - 60;
  end if;
  return new;
end $$;
