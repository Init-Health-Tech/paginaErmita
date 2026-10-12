# Ermita del Silencio

Página web (Next.js) de la Ermita del Silencio. Los formularios y el contenido editable del sitio se guardan en PostgreSQL con Prisma.

## Desarrollo local

Hace falta Node.js, npm y Docker.

```bash
cp .env.example .env
docker compose up -d
npm ci
npm run db:deploy
npm run db:seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

`DATABASE_URL` y `DIRECT_URL` en `.env` apuntan al Postgres de [`docker-compose.yml`](./docker-compose.yml) (`ermita` / `ermita`, base `ermita`, puerto 5432).

| Script | Qué hace |
|--------|----------|
| `npm run db:deploy` | Aplica las migraciones ya versionadas en `prisma/migrations`. Úsalo al clonar el repo y antes de desplegar. |
| `npm run db:seed` | Importa `data/submissions.json` y `data/site-content.json`. Conserva el `createdAt` original. Si no hay archivo de contenido, carga los valores por defecto. Una segunda ejecución no duplica ni sobrescribe filas. |
| `npm run db:migrate` | Crea una migración nueva en desarrollo (`prisma migrate dev`). No lo uses contra la base de producción. |
| `npm run db:studio` | Abre Prisma Studio. |

Los JSON de `data/` se quedan en el disco como origen del seed. Con la aplicación en marcha, las rutas ya no leen ni escriben esa carpeta.

## Despliegue en Vercel

Instrucciones, variables de entorno y el paso manual de migraciones: **[VERCEL.md](./VERCEL.md)**.

El build es `prisma generate && next build`. No aplica migraciones.
