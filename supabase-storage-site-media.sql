-- Execute depois de criar o bucket 'site-media' no Dashboard (Storage -> Create bucket -> Public)
-- Políticas para permitir leitura pública e upload por usuários autenticados em warnings/*

-- Permitir leitura pública
create policy if not exists site_media_read_public on storage.objects
for select
using ( bucket_id = 'site-media' );

-- Permitir upload/write para usuários autenticados
create policy if not exists site_media_write_auth on storage.objects
for insert to authenticated
with check ( bucket_id = 'site-media' );

create policy if not exists site_media_update_auth on storage.objects
for update to authenticated
using ( bucket_id = 'site-media' )
with check ( bucket_id = 'site-media' );

create policy if not exists site_media_delete_auth on storage.objects
for delete to authenticated
using ( bucket_id = 'site-media' );
