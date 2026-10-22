-- Esquema del sistema WM TEC. Pegar completo en Supabase > SQL Editor > Run.
-- Solo los correos de "permitidos" pueden leer o guardar. Cualquier otra cuenta de Google entra pero no ve nada.

create table if not exists public.permitidos (
  email text primary key
);

create table if not exists public.datos (
  id int primary key default 1 check (id = 1),
  contenido jsonb not null default '{}'::jsonb,
  actualizado timestamptz not null default now(),
  actualizado_por text
);

create table if not exists public.copias (
  fecha date primary key,
  contenido jsonb not null
);

insert into public.datos (id) values (1) on conflict do nothing;

create or replace function public.es_permitido() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.permitidos where email = lower(auth.jwt() ->> 'email'));
$$;

-- Antes de cada guardado: sella fecha y autor, y guarda la copia del día (se conservan 60 días)
create or replace function public.antes_de_guardar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.actualizado := now();
  new.actualizado_por := auth.jwt() ->> 'email';
  if old.contenido <> '{}'::jsonb then
    insert into public.copias (fecha, contenido) values (current_date, old.contenido) on conflict (fecha) do nothing;
    delete from public.copias where fecha < current_date - 60;
  end if;
  return new;
end $$;

drop trigger if exists antes_de_guardar on public.datos;
create trigger antes_de_guardar before update on public.datos
  for each row execute function public.antes_de_guardar();

alter table public.permitidos enable row level security;
alter table public.datos enable row level security;
alter table public.copias enable row level security;

revoke all on public.permitidos, public.datos, public.copias from anon, authenticated;
grant select, update (contenido) on public.datos to authenticated;
grant select on public.copias to authenticated;
revoke execute on function public.es_permitido() from public, anon;
grant execute on function public.es_permitido() to authenticated;
revoke execute on function public.antes_de_guardar() from public, anon, authenticated;

drop policy if exists "leer" on public.datos;
drop policy if exists "guardar" on public.datos;
drop policy if exists "leer copias" on public.copias;
create policy "leer" on public.datos for select to authenticated using (public.es_permitido());
create policy "guardar" on public.datos for update to authenticated using (public.es_permitido()) with check (public.es_permitido());
create policy "leer copias" on public.copias for select to authenticated using (public.es_permitido());

-- Correos habilitados (en minúscula)
insert into public.permitidos (email) values
  ('CORREO_DE_WALTER@gmail.com')
on conflict do nothing;
