-- =============================================================================
-- 02_rls.sql — Row Level Security
-- El público (anon/authenticated) solo puede LEER datos publicados.
-- La escritura queda reservada al backend con service_role, que omite RLS.
-- =============================================================================

-- Habilitar RLS en las tres tablas
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.store_config enable row level security;

-- -----------------------------------------------------------------------------
-- Lectura pública
-- -----------------------------------------------------------------------------

-- Solo categorías activas
drop policy if exists public_read_categories on public.categories;
create policy public_read_categories on public.categories
  for select
  to anon, authenticated
  using (active = true);

-- CRÍTICO: solo productos activos. Los borradores nunca se exponen al público.
drop policy if exists public_read_products on public.products;
create policy public_read_products on public.products
  for select
  to anon, authenticated
  using (is_active = true);

-- La configuración de la tienda es pública (WhatsApp, redes, políticas)
drop policy if exists public_read_store_config on public.store_config;
create policy public_read_store_config on public.store_config
  for select
  to anon, authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- Escritura del backend
-- En Supabase, la service_role key omite RLS por diseño. Estas políticas se
-- dejan explícitas para documentar la intención y cubrir roles personalizados.
-- -----------------------------------------------------------------------------

drop policy if exists service_role_write_categories on public.categories;
create policy service_role_write_categories on public.categories
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists service_role_write_products on public.products;
create policy service_role_write_products on public.products
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists service_role_write_store_config on public.store_config;
create policy service_role_write_store_config on public.store_config
  for all
  to service_role
  using (true)
  with check (true);

-- Nota: no se crean políticas de INSERT/UPDATE/DELETE para anon ni authenticated.
-- Sin política, RLS deniega la operación por defecto.
