# Documentación de la API

Base URL: `http://localhost:3001` (desarrollo) / `https://<api>.onrender.com` (producción).

Todas las respuestas de error siguen el formato:
```json
{ "error": "string", "detalles?: Array<{ campo, mensaje }> } }
```

## Catálogo (público)

### GET /products
Lista productos activos con filtros opcionales.

Query params:
- `categoria` (string): slug de categoría
- `talla` (string): talla contenida en `sizes`
- `color` (string): nombre de color contenido en `colors`
- `estado` (string): `available | soldout | featured | coming`
- `precio_min` (number): precio en centavos, ≥ 0
- `precio_max` (number): precio en centavos, ≥ 0
- `busqueda` (string, máx. 80): busca en nombre y SKU

Respuesta: `Product[]`

### GET /products/:slug
Devuelve un producto activo por su slug.

Respuesta: `Product` o `404 { error: "Producto no encontrado" }`

## Panel de administración (requiere autenticación Bearer JWT de Supabase)

### GET /admin/products
Lista **todos** los productos, incluidos borradores (`is_active = false`).

Query params: iguales a `GET /products` (sin filtro de activos).

Respuesta: `Product[]`

### POST /products
Crea un producto. El slug se autogenera desde el nombre si se omite.

Body: `CreateProductInput` (ver `@zapateria/shared`)

Respuesta: `201 Product`

Errores:
- `400` precio de oferta ≥ precio normal
- `409` slug o SKU duplicado

### PUT /products/:id
Actualiza un producto parcialmente.

Body: `UpdateProductInput` (todos los campos opcionales)

Respuesta: `Product`

Errores:
- `404` producto no encontrado
- `400` precio de oferta ≥ precio normal

### DELETE /products/:id
Elimina un producto.

Respuesta: `204`

Errores:
- `404` producto no encontrado

## Categorías

### GET /categories
Lista todas las categorías ordenadas por `display_order`.

Respuesta: `Category[]`

### POST /categories
Crea una categoría (protegido).

Body: `CreateCategoryInput`

Respuesta: `201 Category`

Errores:
- `409` slug duplicado

### PUT /categories/:id
Actualiza una categoría parcialmente (protegido).

Respuesta: `Category`

Errores:
- `404` categoría no encontrada
- `409` slug duplicado

### DELETE /categories/:id
Elimina una categoría (protegido).

Respuesta: `204`

Errores:
- `404` categoría no encontrada
- `409` tiene productos asociados

## Configuración de la tienda

### GET /store-config
Devuelve la configuración global (fila única, `id = 1`).

Respuesta: `StoreConfig`

Errores:
- `404` no encontrada

### PUT /store-config
Actualiza la configuración (protegido).

Body: `UpdateStoreConfigInput`

Respuesta: `StoreConfig`

Errores:
- `404` no encontrada

## Subida de imágenes

### POST /upload
Sube una imagen a Cloudinary (protegido, multipart/form-data).

Campo: `file` (imagen, máx. 5 MB)

Respuesta: `201 { url, public_id }`

Errores:
- `400` no se recibió archivo
- `415` no es una imagen
- `502` error de Cloudinary

## Health

### GET /health
Comprobación de vida del servicio.

Respuesta: `{ status: "ok", timestamp: "..." }`

## Autenticación

Las rutas protegidas exigen el header:
```
Authorization: Bearer <JWT de sesión de Supabase>
```

El JWT se obtiene tras iniciar sesión en Supabase desde el frontend.
