# Despliegue en Vercel

Esta aplicación es un proyecto **Next.js 15** con PostgreSQL (Prisma). Vercel ejecuta el sitio; la base de datos es Neon o Supabase. No hay un servidor aparte.

## Requisitos

- Cuenta en [Vercel](https://vercel.com)
- PostgreSQL gestionado en [Neon](https://neon.tech) o [Supabase](https://supabase.com)
- Repositorio Git (GitHub, GitLab o Bitbucket) con este código, o despliegue con Vercel CLI

## Pasos rápidos (dashboard)

1. En Vercel: **Add New Project** e importa el repositorio.
2. **Framework Preset**: Next.js (por defecto).
3. **Build Command**: `prisma generate && next build` (ya indicado en `vercel.json`). No añadas `prisma migrate deploy` aquí.
4. **Install Command**: `npm ci` (ya indicado en `vercel.json`; requiere `package-lock.json` en el repo). `postinstall` también ejecuta `prisma generate`.
5. **Root Directory**: raíz del repo (salvo que el proyecto esté en un subdirectorio).
6. Añade las variables de entorno (sección siguiente) en **Settings → Environment Variables** para *Production*, *Preview* y *Development* según corresponda.
7. Aplica las migraciones a mano (sección «Migraciones») **antes** de desplegar el código que las necesita.
8. Pulsa **Deploy**.

## Variables de entorno en Vercel

Configúralas en el proyecto: **Settings → Environment Variables**. Copia los nombres desde [`.env.example`](./.env.example).

| Variable | Entorno | Descripción |
|----------|---------|-------------|
| `DATABASE_URL` | Producción y Preview | Conexión **con pooling**, apta para funciones serverless. En Neon es el host `-pooler` con `pgbouncer=true&connection_limit=1`. En Supabase es el pooler, puerto **6543**, con `pgbouncer=true&connection_limit=1`. |
| `DIRECT_URL` | Producción y Preview | Conexión **directa**, sin pooler. Prisma la usa solo en `npm run db:deploy`. En Neon es el host sin `-pooler`. En Supabase es el puerto **5432**. |
| `NEXT_PUBLIC_SITE_URL` | Producción | URL pública **https** del sitio (sin barra final), p. ej. `https://ermita-ejemplo.vercel.app` o tu dominio. Sirve para enlaces y códigos QR de verificación y redirecciones del panel admin. |
| `ADMIN_PASSWORD` | Producción | Contraseña del panel `/admin`. Usa un valor largo y aleatorio; **no** dejes el valor por defecto. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NOTIFY_EMAIL` | Opcional | Si están definidas, se intenta enviar correo al recibir formularios. Si faltan, las solicitudes igual se guardan en PostgreSQL. |

`prisma generate` no abre la base, pero el schema referencia `DATABASE_URL` y `DIRECT_URL`, así que ambas tienen que existir en el entorno de build (pueden ser las de producción o las de una base de preview).

En **Preview** (ramas/PR), define al menos `NEXT_PUBLIC_SITE_URL` con la URL de preview que Vercel asigna, o los enlaces absolutos pueden apuntar mal. Si el preview debe tener datos propios, usa **otra** base y aplica ahí las migraciones a mano. No reutilices la `DATABASE_URL` de producción en los previews.

## Migraciones

El build **no** ejecuta `prisma migrate deploy`. Un preview de Vercel podría apuntar, por error, a la base de producción y migrarla.

Antes de desplegar un cambio que traiga migraciones nuevas:

```bash
# En la máquina local, con DATABASE_URL (pooler) y DIRECT_URL (directa)
# de la base que vas a actualizar —producción o la base aparte del preview—
npm run db:deploy
```

Ese comando aplica solo las migraciones de `prisma/migrations` que todavía no estén en esa base. No crea migraciones nuevas.

`npm run db:migrate` (`prisma migrate dev`) es para desarrollo, contra el Postgres de Docker. No lo ejecutes con la URL de producción.

La primera vez, después de `db:deploy`, puedes importar los JSON existentes. El seed conserva el `createdAt` original y, si se vuelve a correr, no duplica ni sobrescribe filas (`upsert` con `update` vacío):

```bash
npm run db:seed
```

Hazlo con las variables de **esa** base. Si no hay `data/site-content.json`, el seed escribe los valores por defecto del sitio.

## CLI (opcional)

```bash
npm i -g vercel
cd ruta/al/proyecto
vercel        # preview
vercel --prod # producción
```

Tras el primer despliegue, vincula el proyecto y configura las mismas variables con `vercel env pull` o en el dashboard. Sigue aplicando las migraciones con `npm run db:deploy` antes del despliegue, no dentro del build.

## Dominio propio

En el proyecto Vercel: **Settings → Domains**. Añade el dominio y sigue las instrucciones DNS. Actualiza `NEXT_PUBLIC_SITE_URL` al dominio definitivo con `https`.

## Imágenes de la galería

Las fotos en `public/Fotos` forman parte del despliegue. Añádelas al repositorio o adapta el flujo (por ejemplo almacenamiento en la nube) si necesitas subir imágenes sin redeploy.

## Comprobaciones tras el despliegue

- Página principal y navegación.
- Envío de un formulario (y correo, si configuraste SMTP).
- `/admin` con tu `ADMIN_PASSWORD`.
- Un enlace `/verificar/[id]` generado tras un envío.
- `/acceso/[token]` con las visitas del día.

## Archivos relacionados

- [`vercel.json`](./vercel.json) — framework Next.js, `npm ci` y build `prisma generate && next build`.
- [`.env.example`](./.env.example) — plantilla de variables para copiar al configurar Vercel.
- [`prisma/schema.prisma`](./prisma/schema.prisma) — modelo de datos.
- [`docker-compose.yml`](./docker-compose.yml) — Postgres local.

Opcional: en `vercel.json` puedes añadir `"regions": ["iad1"]` (u otra región cercana a tus usuarios) para las funciones serverless; si no, Vercel elige una por defecto.
