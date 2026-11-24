# LTC Experiential · Sitio web

Sitio estático (HTML + CSS + JS), sin dependencias ni compilación. Se publica en Netlify desde GitHub.

```
/                       → redirige a /bienvenida/
/bienvenida/            → sitio principal
/bienvenida/gracias.html → página después de enviar el formulario
/assets/                → estilos, JS, logo, fotos
```

## 1. Subir a GitHub
```bash
git init
git add .
git commit -m "Sitio LTC Experiential"
git branch -M main
git remote add origin https://github.com/USUARIO/ltc-experiential-web.git
git push -u origin main
```

## 2. Publicar en Netlify
1. netlify.com → **Add new site → Import an existing project → GitHub** → elegir el repo.
2. Build command: *(vacío)* · Publish directory: `.` → **Deploy**.
## 3. Formulario de contacto (sin mostrar el correo)
Usa **Netlify Forms**, que ya viene activado en el HTML.
- Netlify → **Forms** → activar *Form detection* (si lo pide) y volver a desplegar.
- **Forms → Form notifications → Add notification → Email notification** → poner los correos de LTC que deben recibir los mensajes.
- Plan gratis: 100 envíos al mes.

## 4. Conectar el dominio ltcproducciones.mx
1. Netlify → **Domain management → Add a domain** → `ltcproducciones.mx`.
2. En el registrador del dominio (Akky, GoDaddy, etc.) apuntar los DNS como indique Netlify.
3. **Antes:** respaldar el WordPress actual y **conservar los registros MX** si usan correo con ese dominio.

## 5. Pendientes por llenar
| Qué | Dónde |
|---|---|
| Teléfono, WhatsApp, dirección | `bienvenida/index.html`, sección *Contacto* (buscar `PENDIENTE`) |
| Logos de clientes | Guardarlos en `assets/clientes/` y cambiar los `<span class="client">` por `<img>` |
| Fotos de proyectos | Guardar `proyecto-1.jpg` … `proyecto-5.jpg` en `assets/proyectos/` (aparecen solas, ~1600 px de ancho) |

## Ver en local
```bash
python3 -m http.server 8000
# abrir http://localhost:8000/bienvenida/
```
