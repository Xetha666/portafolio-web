import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  
  // Redirección profesional: de .pages.dev a dominio principal
  if (url.hostname.includes("pages.dev")) {
    return context.redirect(`https://bryansantillan.dev${url.pathname}${url.search}`, 301);
  }

  // Solo aplicar rate limit a las rutas de la API
  if (context.url.pathname.startsWith("/api/")) {
    const runtime = context.locals.runtime;
    
    // Si no estamos en entorno Cloudflare (ej. dev local sin proxy), saltamos
    if (!runtime || !runtime.env || !runtime.env.RATELIMIT_KV) {
      return next();
    }

    const kv = runtime.env.RATELIMIT_KV;
    const ip = context.request.headers.get("cf-connecting-ip") || "unknown";
    
    // Si no podemos identificar la IP, permitimos pero registramos advertencia
    if (ip === "unknown") {
      console.warn("No se pudo identificar la IP del cliente para el rate limit");
      return next();
    }

    const key = `ratelimit:${ip}`;
    const limit = 50;
    const duration = 3600; // 1 hora en segundos

    try {
      const current = await kv.get(key);
      const count = current ? parseInt(current) : 0;

      if (count >= limit) {
        return new Response(
          JSON.stringify({ 
            message: "Demasiadas peticiones. Por favor, inténtalo de nuevo más tarde.",
            retryAfter: "1 hora" 
          }), 
          { 
            status: 429, 
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*" 
            } 
          }
        );
      }

      // Incrementar contador y establecer expiración de 1 hora
      await kv.put(key, (count + 1).toString(), { expirationTtl: duration });
      
    } catch (error) {
      console.error("Error en Rate Limit Middleware:", error);
      // En caso de error en KV, permitimos la petición por resiliencia
      return next();
    }
  }

  return next();
});
