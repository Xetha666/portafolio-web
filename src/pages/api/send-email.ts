export const prerender = false;
import { ContactSchema } from '@/schemas/contact';
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    
    // Validar con Zod
    const result = ContactSchema.safeParse(body);
    
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0]?.toString() || 'general';
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      });

      return new Response(
        JSON.stringify({ 
          message: "Validación fallida", 
          errors: fieldErrors 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { nombre, email, asunto, mensaje, _honey } = result.data;

    // Verificar Honeypot (Anti-bot)
    if (_honey) {
      // Ignoramos silenciosamente si es un bot
      return new Response(
        JSON.stringify({ message: "Mensaje recibido" }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Inicializar Resend con la API Key del entorno
    const runtimeEnv = locals.runtime?.env || {};
    const resendApiKey = runtimeEnv.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    const destination = runtimeEnv.DESTINATION_EMAIL || import.meta.env.DESTINATION_EMAIL;

    const resend = new Resend(resendApiKey);

    // Enviar el correo
    const { error } = await resend.emails.send({
      from: 'Portafolio Contact <contacto@bryansantillan.dev>',
      to: [destination],
      subject: `💼 Contacto: ${asunto}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #007bff;">Tienes un nuevo mensaje de contacto</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>De:</strong> ${nombre} (&lt;${email}&gt;)</p>
          <p><strong>Asunto:</strong> ${asunto}</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap;">${mensaje}</p>
          </div>
          <footer style="margin-top: 30px; font-size: 12px; color: #777;">
            Este correo fue enviado automáticamente desde tu portafolio web.
          </footer>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ message: "Hubo un problema al enviar el correo" }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: "¡Mensaje enviado correctamente!"}), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(
      JSON.stringify({ message: "Error interno en el servidor" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
