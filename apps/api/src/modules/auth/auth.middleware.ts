import type { User } from "@supabase/supabase-js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { supabaseAdmin } from "../../config/database";

declare module "fastify" {
  interface FastifyRequest {
    /** Usuario autenticado; solo existe en rutas protegidas por requireAuth. */
    usuario?: User;
  }
}

/**
 * Verifica el JWT de Supabase del header Authorization.
 * Se usa como preHandler en cada ruta protegida; no como hook global,
 * porque las rutas públicas del catálogo no deben exigir sesión.
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const cabecera = request.headers.authorization;

  if (!cabecera?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Token de autenticación requerido" });
  }

  const token = cabecera.slice("Bearer ".length).trim();
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return reply.code(401).send({ error: "Token inválido o expirado" });
  }

  request.usuario = data.user;
}
