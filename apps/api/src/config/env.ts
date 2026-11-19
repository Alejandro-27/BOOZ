import "dotenv/config";
import { z } from "zod";

/**
 * Esquema de variables de entorno. La API no arranca si falta alguna
 * credencial obligatoria, para fallar rápido y con un mensaje claro.
 */
const esquemaEntorno = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  SUPABASE_URL: z.url("SUPABASE_URL debe ser una URL válida"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY es obligatoria"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME es obligatorio"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY es obligatorio"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET es obligatorio"),
  // No se usa en la subida firmada desde el backend, pero se conserva para el frontend
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const resultado = esquemaEntorno.safeParse(process.env);

if (!resultado.success) {
  console.error("Variables de entorno inválidas. Revisa tu archivo .env:");
  for (const problema of resultado.error.issues) {
    console.error(`  - ${problema.path.join(".") || "(raíz)"}: ${problema.message}`);
  }
  process.exit(1);
}

export const env = resultado.data;
