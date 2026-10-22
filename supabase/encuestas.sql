-- Encuesta de conformidad. Pegar en Supabase > SQL Editor > Run (una vez).
-- El cliente solo puede abrir y contestar la encuesta de su enlace (por token). No ve nada más.
-- Solo los correos permitidos crean, ven y borran encuestas.

create table if not exists public.encuestas (
  token uuid primary key,
  creada timestamptz not null default now(),
  tid text,
  cid text,
  cliente text check (length(cliente) <= 60),
  ot text check (length(ot) <= 160),
  respuestas jsonb,
  comentario text check (length(comentario) <= 2000),
  respondida timestamptz
);

alter table public.encuestas enable row level security;
revoke all on public.encuestas from anon, authenticated;
grant select, insert, delete on public.encuestas to authenticated;

drop policy if exists "enc ver" on public.encuestas;
drop policy if exists "enc crear" on public.encuestas;
drop policy if exists "enc borrar" on public.encuestas;
create policy "enc ver" on public.encuestas for select to authenticated using (public.es_permitido());
create policy "enc crear" on public.encuestas for insert to authenticated with check (public.es_permitido());
create policy "enc borrar" on public.encuestas for delete to authenticated using (public.es_permitido());

-- Lo único que ve el cliente: su nombre, la orden y si ya respondió
create or replace function public.encuesta_ver(t uuid)
returns table (cliente text, ot text, respondida boolean)
language sql security definer set search_path = public stable as $$
  select e.cliente, e.ot, e.respondida is not null from public.encuestas e where e.token = t
$$;

-- Guarda las respuestas una sola vez
create or replace function public.encuesta_responder(t uuid, r jsonb, c text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if jsonb_typeof(r) <> 'object' or length(r::text) > 400 then return false; end if;
  update public.encuestas set respuestas = r, comentario = nullif(left(coalesce(c, ''), 2000), ''), respondida = now()
  where token = t and respondida is null;
  return found;
end $$;

revoke all on function public.encuesta_ver(uuid) from public;
revoke all on function public.encuesta_responder(uuid, jsonb, text) from public;
grant execute on function public.encuesta_ver(uuid) to anon, authenticated;
grant execute on function public.encuesta_responder(uuid, jsonb, text) to anon, authenticated;
