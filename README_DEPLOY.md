# Despliegue en producción

Guía paso a paso para publicar la tienda: **Supabase** (base de datos y auth), **Render** (API Fastify) y **Cloudflare** (web Next.js).

> Orden recomendado: Supabase → Render → Cloudflare. La web necesita la URL de la API y la API necesita el dominio final de la web para CORS, así que al terminar se ajusta `CORS_ORIGIN` y se vuelve a desplegar la API.

---

## 0. Requisitos y verificación local

- Node.js 22 o superior y pnpm 12 (`corepack enable`).
- Cuenta en Supabase, Render y Cloudflare.
- El monorepo compila:

```bash
pnpm install --frozen-lockfile
pnpm build
```

---

## 1. Supabase (base de datos)

1. Crea un proyecto en <https://supabase.com/dashboard> y guarda la contraseña de la base de datos.
2. Abre **SQL Editor** y ejecuta los scripts **en este orden**:
   1. `sql/01_schema.sql` — tablas, tipos e índices.
   2. `sql/02_rls.sql` — Row Level Security y políticas.
   3. `sql/03_seed.sql` — categorías, productos de ejemplo y configuración de la tienda.
3. En **Project Settings → API** copia:
   - `Project URL` → `SUPABASE_URL` (API) y `NEXT_PUBLIC_SUPABASE_URL` (web).
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (web).
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (solo API; **nunca** en la web).
4. En **Authentication → Users → Add user** crea el usuario administrador con email y contraseña, marcando **Auto Confirm User**.
5. La tabla `store_config` debe conservar `id = 1`: la API lo usa fijo.

---

## 2. Render (API Fastify)

1. **New → Web Service** y conecta el repositorio.
2. Configuración:
   - **Root Directory**: la raíz del repositorio (déjala vacía).
   - **Build Command**:
     ```bash
     pnpm install --frozen-lockfile && pnpm --filter @zapateria/api... build
     ```
     El `...` compila también `@zapateria/shared`, que la API importa en tiempo de ejecución.
   - **Start Command**:
     ```bash
     node apps/api/dist/server.js
     ```
   - **Health Check Path**: `/health`.
   - **Environment**: Node 22 (Render lo toma de `engines` en `package.json`).
3. Variables de entorno:

   | Variable | Valor |
   | --- | --- |
   | `SUPABASE_URL` | URL del proyecto de Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | clave `service_role` (secreta) |
   | `CLOUDINARY_CLOUD_NAME` | nombre del cloud de Cloudinary |
   | `CLOUDINARY_API_KEY` | API key de Cloudinary |
   | `CLOUDINARY_API_SECRET` | API secret de Cloudinary |
   | `CORS_ORIGIN` | dominio final de la web, sin barra final (ej. `https://zapateria.pages.dev`) |

   `PORT` lo inyecta Render automáticamente; no lo definas.
4. Despliega y verifica `https://<api>.onrender.com/health`. Debe responder `200`.

> `CORS_ORIGIN` admite varios orígenes separados por comas, útil para probar el dominio de producción y uno de preview.

---

## 3. Cloudflare (web Next.js)

> **Importante:** Cloudflare retiró el adaptador de Next.js para Pages (`@cloudflare/next-on-pages`, archivado) y recomienda **Workers** para aplicaciones con SSR. Esta app usa SSR, middleware y rutas dinámicas, así que se despliega como Worker con el adaptador **OpenNext**, que ya está configurado en `apps/web` (`open-next.config.ts`, `wrangler.jsonc`). Sigue siendo la misma cuenta y el mismo flujo Git de Cloudflare; solo cambia el producto (Workers en lugar de Pages).

### Opción A — Desde el panel de Cloudflare (recomendada)

1. **Workers & Pages → Create → Workers → Connect to Git** y elige el repositorio.
2. Configuración del build:
   - **Root Directory**: raíz del repositorio.
   - **Build Command**:
     ```bash
     pnpm install --frozen-lockfile && pnpm --filter @zapateria/web exec opennextjs-cloudflare build
     ```
   - **Deploy Command**:
     ```bash
     pnpm --filter @zapateria/web exec wrangler deploy
     ```
3. Variables de entorno (aplican al build y al runtime):

   | Variable | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | URL pública de la API en Render |
   | `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clave `anon public` |
   | `NEXT_PUBLIC_SITE_URL` | dominio final de la web (ej. `https://zapateria.tudominio.com`) |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | nombre del cloud de Cloudinary |

   Las variables `NEXT_PUBLIC_*` se incrustan en el bundle **durante el build**: si cambias una, vuelve a desplegar.
4. Asigna un dominio (Workers → Settings → Domains & Routes). Usa ese mismo valor en `NEXT_PUBLIC_SITE_URL`.

### Opción B — Desde tu equipo

```bash
# Una sola vez
pnpm --filter @zapateria/web exec wrangler login

# Build + deploy del Worker
pnpm --filter @zapateria/web deploy
```

Para previsualizar en local con el runtime de Workers:

```bash
pnpm --filter @zapateria/web preview
```

---

## 4. Cierre: conectar web y API

1. Copia el dominio final de la web.
2. En Render, actualiza `CORS_ORIGIN` con ese dominio (sin `/` final) y vuelve a desplegar la API.
3. Confirma que `NEXT_PUBLIC_API_URL` en Cloudflare apunta a la API de Render y que `NEXT_PUBLIC_SITE_URL` es el dominio final (se usa en QR, metadatos y sitemap).

---

## 5. Verificación posterior al despliegue

- [ ] `GET https://<api>.onrender.com/health` → `200`.
- [ ] `GET https://<api>.onrender.com/products` → lista de productos activos.
- [ ] La home carga el catálogo sin errores de CORS en la consola del navegador.
- [ ] `/admin/login` permite entrar con el usuario creado en Supabase.
- [ ] Crear/editar un producto, subir una imagen y despublicarlo (debe aparecer como **Borrador** en el panel y desaparecer del catálogo público).
- [ ] `/admin/qr` genera y descarga el PNG con la URL correcta.
- [ ] `/sitemap.xml` incluye las páginas y los productos; `/robots.txt` apunta al sitemap.
- [ ] Compartir un enlace de producto muestra título, descripción e imagen (OpenGraph).

## Problemas comunes

- **Error de CORS**: `CORS_ORIGIN` no coincide exactamente con el origen de la web (esquema, dominio y sin barra final). Cambiarlo exige redeploy en Render.
- **401 en el panel**: el usuario no existe o no está confirmado en Supabase; créalo con **Auto Confirm User**.
- **Imágenes rotas**: revisa las credenciales de Cloudinary en Render y que la URL guardada sea `https://res.cloudinary.com/...`.
- **Variables públicas sin efecto**: se inlinean en build; vuelve a desplegar la web después de cambiarlas.
