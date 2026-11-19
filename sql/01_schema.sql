-- =============================================================================
-- 01_schema.sql — Esquema base de la zapatería
-- Ejecutar en el SQL Editor de Supabase (proyecto > SQL Editor > New query).
-- Es idempotente: se puede volver a ejecutar sin duplicar objetos.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Categorías del catálogo
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

comment on table public.categories is 'Categorías del catálogo (Formal, Boda, Botas, etc.)';

-- -----------------------------------------------------------------------------
-- Productos
-- price y sale_price se guardan en centavos (ej: 189900 = $1,899.00)
-- sizes/colors/images son jsonb para permitir flexibilidad futura
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  short_description text not null default '',
  long_description  text not null default '',
  price             integer not null check (price >= 0),
  sale_price        integer check (sale_price is null or sale_price >= 0),
  sku               text unique,
  category_id       uuid not null references public.categories (id) on delete restrict,
  sizes             jsonb not null default '[]'::jsonb,
  colors            jsonb not null default '[]'::jsonb,
  images            jsonb not null default '[]'::jsonb,
  tags              text[] not null default '{}',
  material          text not null default '',
  status            text not null default 'available'
                    check (status in ('available', 'soldout', 'featured', 'coming')),
  stock             integer check (stock is null or stock >= 0),
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  -- La oferta siempre debe ser menor que el precio normal
  constraint products_sale_price_menor_que_precio
    check (sale_price is null or sale_price < price)
);

comment on table public.products is 'Productos del catálogo; precios en centavos';
comment on column public.products.sizes is 'Array JSON de tallas, ej: ["39","40","41"]';
comment on column public.products.colors is 'Array JSON de colores, ej: [{"name":"Negro","hex":"#111111"}]';
comment on column public.products.images is 'Array JSON de imágenes, ej: [{"url":"...","alt":"..."}]';

-- Índices para los filtros del catálogo
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_activos on public.products (is_active) where is_active = true;
create index if not exists idx_categories_orden on public.categories (active, display_order);

-- Índices GIN para los filtros por talla, color y etiquetas (operador @>)
create index if not exists idx_products_sizes on public.products using gin (sizes jsonb_path_ops);
create index if not exists idx_products_colors on public.products using gin (colors jsonb_path_ops);
create index if not exists idx_products_tags on public.products using gin (tags);

-- -----------------------------------------------------------------------------
-- Configuración de la tienda: fila única con id = 1
-- -----------------------------------------------------------------------------
create table if not exists public.store_config (
  id           integer primary key default 1 check (id = 1),
  name         text not null default 'Mi Zapatería',
  slogan       text not null default '',
  logo_url     text,
  whatsapp     text not null default '',
  email        text,
  instagram    text,
  address      text,
  city         text,
  policies     text,
  brand_colors jsonb not null default
               '{"primary":"#1A1A1A","secondary":"#8B5E3C","accent":"#D4AF37"}'::jsonb,
  updated_at   timestamptz not null default now()
);

comment on table public.store_config is 'Configuración global de la tienda (fila única, id = 1)';

-- Fila inicial obligatoria para que la API siempre tenga qué leer
insert into public.store_config (id) values (1)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Trigger reutilizable para mantener updated_at al día
-- -----------------------------------------------------------------------------
create or replace function public.actualizar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.actualizar_updated_at();

drop trigger if exists trg_store_config_updated_at on public.store_config;
create trigger trg_store_config_updated_at
  before update on public.store_config
  for each row execute function public.actualizar_updated_at();
