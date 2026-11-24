// Protege /bienvenida con usuario y contraseña (autenticación básica).
// La contraseña NO va en el código: se configura en Netlify →
// Site configuration → Environment variables:
//   SITE_USER      (opcional, por defecto "ltc")
//   SITE_PASSWORD  (obligatoria; si no existe, nadie puede entrar)

export default async (request, context) => {
  const user = Netlify.env.get("SITE_USER") || "ltc";
  const pass = Netlify.env.get("SITE_PASSWORD");
  const header = request.headers.get("authorization") || "";

  if (pass && header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const i = decoded.indexOf(":");
      if (decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) {
        return context.next();
      }
    } catch (_) {
      /* encabezado inválido: se pide de nuevo */
    }
  }

  return new Response("Acceso restringido. Ingresa el usuario y la contraseña de LTC Experiential.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LTC Experiential", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

export const config = { path: ["/bienvenida", "/bienvenida/*"] };
