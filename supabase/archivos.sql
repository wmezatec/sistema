-- Fotos y videos de las órdenes de trabajo. Pegar en Supabase > SQL Editor > Run (una vez).
-- Carpeta privada: solo los correos permitidos suben, ven y borran. Máximo 50 MB por archivo.

insert into storage.buckets (id, name, public, file_size_limit)
values ('archivos', 'archivos', false, 52428800)
on conflict (id) do nothing;

drop policy if exists "archivos ver" on storage.objects;
drop policy if exists "archivos subir" on storage.objects;
drop policy if exists "archivos borrar" on storage.objects;
create policy "archivos ver" on storage.objects for select to authenticated using (bucket_id = 'archivos' and public.es_permitido());
create policy "archivos subir" on storage.objects for insert to authenticated with check (bucket_id = 'archivos' and public.es_permitido());
create policy "archivos borrar" on storage.objects for delete to authenticated using (bucket_id = 'archivos' and public.es_permitido());
