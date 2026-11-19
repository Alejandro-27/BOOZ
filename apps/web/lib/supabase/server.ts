import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Cliente de Supabase para Server Components y Server Actions. */
export async function crearClienteServidor() {
  const almacenCookies = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => almacenCookies.getAll(),
        setAll: (cookiesAEstablecer) => {
          try {
            for (const { name, value, options } of cookiesAEstablecer) {
              almacenCookies.set(name, value, options);
            }
          } catch {
            // En Server Components no se pueden escribir cookies.
            // El middleware se encarga de refrescar la sesión.
          }
        },
      },
    },
  );
}
