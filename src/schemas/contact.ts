import { z } from "zod";

/**
 * Esquema de validación para el formulario de contacto.
 * Aplica estándares de sanitización (.trim()) y mensajes en español.
 */
export const ContactSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre es demasiado largo"),
  
  email: z
    .string()
    .trim()
    .email("Por favor, ingresa un correo electrónico válido")
    .toLowerCase(),

  asunto: z
    .string()
    .trim()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(100, "El asunto es demasiado largo"),
  
  mensaje: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje es demasiado largo"),

  // Campo honeypot para evitar bots (debe estar vacío)
  _honey: z.string().max(0).optional(),
});

/**
 * Tipo inferido para el formulario de contacto.
 * Úsalo para mantener la seguridad de tipos en el frontend y backend.
 */
export type Contact = z.infer<typeof ContactSchema>;
