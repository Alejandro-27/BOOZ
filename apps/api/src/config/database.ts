import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Cliente con service_role: omite RLS y solo debe usarse en el backend.
 * Nunca exponer esta clave en el frontend.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
