# Despliegue en producción — nanogro.lat

El código ya está listo. Lo que falta es **conectar el repositorio a un hosting**, y eso requiere
tu cuenta: nadie más puede hacerlo por ti.

---

## 1. Qué ya está resuelto en el código

- **Español por defecto.** La raíz `nanogro.lat` sirve español aunque el navegador esté en inglés.
  El inglés solo aparece si el usuario entra a `/en` o lo elige en el selector.
- **Tema claro por defecto.** Ya no se sigue la preferencia del sistema operativo. El botón de
  tema sigue ahí y recuerda la elección de cada usuario.
- **Dominio.** `nanogro.lat` es el valor por defecto de `NEXT_PUBLIC_SITE_URL`, así que las URLs
  canónicas, el `hreflang`, el sitemap y la imagen de WhatsApp ya apuntan ahí.
- **Vista previa de WhatsApp.** La imagen se genera sola en el build (`app/opengraph-image.tsx`).
- **Favicon.** El "mundo gris" del navegador está sustituido por el logo (`app/icon.svg`).

## 2. Variables de entorno (esto es lo único que tienes que rellenar)

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Sí | `https://nanogro.lat` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | **Sí** | Número del equipo, solo dígitos con código de país (ej. `50312345678`). **Si está vacío, los botones de WhatsApp no se pintan** — es deliberado: un `wa.me` sin número abre el selector de contactos del propio usuario y el lead se pierde. |
| `NANO_GRO_WHATSAPP_NUMBER` | Sí | El mismo número, para el servidor. |
| `ADMIN_PASSWORD` | Sí | Contraseña del panel `/admin`. **Cámbiala antes de publicar.** |
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Sin Supabase, la web funciona con los 26 casos reales del código. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | |
| `SUPABASE_STORAGE_BUCKET` | No* | `evidence` |

\* Sin las claves de Supabase el sitio se ve completo y navegable, pero **los leads del
diagnóstico no se guardan en ninguna base de datos**. Para capturar leads de verdad hay que
configurarlas.

## 3. Desplegar en Vercel (15 minutos)

1. Entra en [vercel.com](https://vercel.com) y crea la cuenta (o entra con tu GitHub).
2. **Add New → Project** → importa `mharr92-hub/nanogro`.
3. Vercel detecta Next.js solo. No cambies nada de la configuración de build.
4. En **Environment Variables**, pega las de la tabla de arriba.
5. **Deploy**.
6. Cuando termine: **Settings → Domains → Add** → `nanogro.lat`.
7. Vercel te dará unos registros DNS. Ponlos donde tengas comprado el dominio:
   - `A` para `nanogro.lat` → `76.76.21.21`
   - `CNAME` para `www` → `cname.vercel-dns.com`
   (Vercel te muestra los valores exactos; usa los suyos, no estos de memoria.)
8. El certificado HTTPS lo emite Vercel solo, en unos minutos.

## 4. Qué rama desplegar

La rama con todo el rediseño es **`redesign/v2`**.

Vercel despliega `main` por defecto. Tienes dos opciones:

- **Mergear `redesign/v2` → `main`** desde GitHub (botón "Merge pull request") y desplegar `main`.
  Es lo normal.
- O, en Vercel: **Settings → Git → Production Branch** → `redesign/v2`.

> Yo no puedo hacer el merge ni el push a `main`: tu instrucción inicial fue explícita
> ("nunca hagas push directo a main, abre un PR, yo lo reviso") y el sistema de permisos la
> respeta por encima de una autorización posterior en el chat. El merge tienes que darle tú.

## 5. Antes de anunciar el sitio

- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` puesto (si no, no hay canal de WhatsApp).
- [ ] `ADMIN_PASSWORD` cambiada.
- [ ] Supabase configurado si quieres capturar leads.
- [ ] Comparte el enlace en un chat de WhatsApp contigo mismo y comprueba que sale la miniatura
      con el logo.
