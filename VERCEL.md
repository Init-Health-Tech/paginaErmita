# Despliegue en Vercel

Esta aplicación es un proyecto **Next.js 15**. Vercel la detecta automáticamente; los archivos de esta carpeta completan la configuración y documentan variables de entorno y limitaciones.

## Requisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio Git (GitHub, GitLab o Bitbucket) con este código, o despliegue con Vercel CLI

## Pasos rápidos (dashboard)

1. En Vercel: **Add New Project** e importa el repositorio.
2. **Framework Preset**: Next.js (por defecto).
3. **Build Command**: `npm run build` (ya indicado en `vercel.json`).
4. **Install Command**: `npm ci` (ya indicado en `vercel.json`; requiere `package-lock.json` en el repo).
5. **Root Directory**: raíz del repo (salvo que el proyecto esté en un subdirectorio).
6. Añade las variables de entorno (sección siguiente) en **Settings → Environment Variables** para *Production*, *Preview* y *Development* según corresponda.
7. Pulsa **Deploy**.

## Variables de entorno en Vercel

Configúralas en el proyecto: **Settings → Environment Variables**. Copia los nombres desde [`.env.example`](./.env.example).

| Variable | Entorno | Descripción |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Producción | URL pública **https** del sitio (sin barra final), p. ej. `https://ermita-ejemplo.vercel.app` o tu dominio. Sirve para enlaces y códigos QR de verificación y redirecciones del panel admin. |
| `ADMIN_PASSWORD` | Producción | Contraseña del panel `/admin`. Usa un valor largo y aleatorio; **no** dejes el valor por defecto. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NOTIFY_EMAIL` | Opcional | Si están definidas, se intenta enviar correo al recibir formularios. Si faltan, los envíos solo se registran en almacenamiento (ver advertencia abajo). |

En **Preview** (ramas/PR), define al menos `NEXT_PUBLIC_SITE_URL` con la URL de preview que Vercel asigna, o los enlaces absolutos pueden apuntar mal.

## CLI (opcional)

```bash
npm i -g vercel
cd ruta/al/proyecto
vercel        # preview
vercel --prod # producción
```

Tras el primer despliegue, Vincula el proyecto y configura las mismas variables con `vercel env pull` o en el dashboard.

## Dominio propio

En el proyecto Vercel: **Settings → Domains**. Añade el dominio y sigue las instrucciones DNS. Actualiza `NEXT_PUBLIC_SITE_URL` al dominio definitivo con `https`.

## Almacenamiento de formularios (muy importante)

Los registros de formularios se guardan hoy en **`data/submissions.json`** en disco.

En Vercel, las funciones serverless usan un sistema de archivos **efímero**: los datos escritos **no se conservan** de forma fiable entre invocaciones ni entre despliegues. El panel `/admin` y la verificación por ID pueden **no funcionar en producción** hasta que migres a un almacenamiento persistente.

Opciones habituales:

- **Vercel Postgres**, **Supabase**, **PlanetScale**, **MongoDB Atlas**, etc.
- **Vercel KV** o **Blob** si el modelo de datos encaja.

Hasta entonces, el sitio estático y las páginas pueden desplegarse bien, pero **no debes confiar en el archivo JSON en producción**.

## Imágenes de la galería

Las fotos en `public/Fotos` forman parte del despliegue. Añádelas al repositorio o adapta el flujo (por ejemplo almacenamiento en la nube) si necesitas subir imágenes sin redeploy.

## Comprobaciones tras el despliegue

- Página principal y navegación.
- Envío de un formulario (y correo, si configuraste SMTP).
- `/admin` con tu `ADMIN_PASSWORD`.
- Un enlace `/verificar/[id]` generado tras un envío (cuando el almacenamiento sea persistente).

## Archivos relacionados

- [`vercel.json`](./vercel.json) — framework Next.js, `npm ci` y `npm run build`.
- [`.env.example`](./.env.example) — plantilla de variables para copiar al configurar Vercel.

Opcional: en `vercel.json` puedes añadir `"regions": ["iad1"]` (u otra región cercana a tus usuarios) para las funciones serverless; si no, Vercel elige una por defecto.
