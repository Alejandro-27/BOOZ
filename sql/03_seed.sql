-- =============================================================================
-- 03_seed.sql — Datos iniciales de ejemplo
-- Idempotente: se puede ejecutar varias veces sin duplicar filas.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Categorías
-- -----------------------------------------------------------------------------
insert into public.categories (name, slug, display_order) values
  ('Formal',           'formal',           1),
  ('Casual Elegante',  'casual-elegante',  2),
  ('Boda',             'boda',             3),
  ('Botas',            'botas',            4)
on conflict (slug) do update
  set name = excluded.name,
      display_order = excluded.display_order;

-- -----------------------------------------------------------------------------
-- Configuración de la tienda (fila única)
-- -----------------------------------------------------------------------------
insert into public.store_config (
  id, name, slogan, whatsapp, email, instagram, address, city, policies, brand_colors
) values (
  1,
  'BOOZ',
  'Calzado masculino de vestir, hecho con carácter',
  '573003080609',
  'boozshoes8@gmail.com',
  'boozshoes',
  'Arauca, Colombia',
  '',
  'Cambios dentro de los 5 días hábiles conservando caja y etiquetas. Zona de entrega: Arauca, Colombia.',
  '{"primary":"#1A1A1A","secondary":"#8B5E3C","accent":"#D4AF37"}'::jsonb
)
on conflict (id) do update
  set name = excluded.name,
      slogan = excluded.slogan,
      whatsapp = excluded.whatsapp,
      email = excluded.email,
      instagram = excluded.instagram,
      address = excluded.address,
      city = excluded.city,
      policies = excluded.policies,
      brand_colors = excluded.brand_colors;

-- -----------------------------------------------------------------------------
-- Productos de ejemplo
-- Precios en centavos: 189900 = $1,899.00
-- Las URLs usan una imagen de demostración de Cloudinary.
-- -----------------------------------------------------------------------------
insert into public.products (
  slug, name, short_description, long_description,
  price, sale_price, sku, category_id,
  sizes, colors, images, tags, material, status, stock, is_active
) values
  (
    'zapato-oxford-negro',
    'Zapato Oxford Negro',
    'Clásico de vestir en piel vacuna, ideal para traje formal.',
    'Zapato Oxford de piel vacuna con acabado pulido, suela de cuero y forro transpirable. Un imprescindible para eventos formales y oficina.',
    189900, null, 'OXF-NEG-001',
    (select id from public.categories where slug = 'formal'),
    '["39","40","41","42","43","44"]'::jsonb,
    '[{"name":"Negro","hex":"#111111"}]'::jsonb,
    '[{"url":"https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/sample.jpg","alt":"Zapato Oxford negro de frente"}]'::jsonb,
    '{formal,clasico,oficina}', 'Piel vacuna', 'featured', 12, true
  ),
  (
    'derby-marron-cuero',
    'Derby Marrón en Cuero',
    'Derby casual elegante, combina con jeans oscuros y chinos.',
    'Zapato Derby de cuero marrón con costuras a mano y suela de goma antideslizante. Comodidad para el día a día sin perder elegancia.',
    159900, 139900, 'DER-MAR-002',
    (select id from public.categories where slug = 'casual-elegante'),
    '["40","41","42","43","44","45"]'::jsonb,
    '[{"name":"Marrón","hex":"#6B4423"},{"name":"Café","hex":"#4A2C17"}]'::jsonb,
    '[{"url":"https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/sample.jpg","alt":"Zapato Derby marrón de perfil"}]'::jsonb,
    '{casual,cuero,diario}', 'Cuero', 'available', 8, true
  ),
  (
    'mocasin-boda-negro',
    'Mocasín de Boda Negro',
    'Mocasín de vestir con detalle metálico, pensado para el novio.',
    'Mocasín de piel con hebilla metálica dorada y suela fina. Acabado elegante para bodas y eventos de etiqueta.',
    219900, null, 'MOC-BOD-003',
    (select id from public.categories where slug = 'boda'),
    '["39","40","41","42","43"]'::jsonb,
    '[{"name":"Negro","hex":"#111111"}]'::jsonb,
    '[{"url":"https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/sample.jpg","alt":"Mocasín de boda negro con detalle dorado"}]'::jsonb,
    '{boda,etiqueta,premium}', 'Piel', 'featured', 5, true
  ),
  (
    'bota-chelsea-cafe',
    'Bota Chelsea Café',
    'Bota Chelsea de caña baja, versátil para clima frío.',
    'Bota Chelsea de piel café con elástico lateral y suela de goma. Estilo inglés para looks casuales de temporada.',
    199900, 179900, 'BOT-CHE-004',
    (select id from public.categories where slug = 'botas'),
    '["40","41","42","43","44"]'::jsonb,
    '[{"name":"Café","hex":"#4A2C17"}]'::jsonb,
    '[{"url":"https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/sample.jpg","alt":"Bota Chelsea café de perfil"}]'::jsonb,
    '{botas,invierno,casual}', 'Piel', 'coming', null, true
  )
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- Comprobación rápida (opcional, se puede borrar)
-- -----------------------------------------------------------------------------
-- select c.name as categoria, p.name as producto, p.price / 100.0 as precio
-- from public.products p
-- join public.categories c on c.id = p.category_id
-- order by c.display_order, p.name;
