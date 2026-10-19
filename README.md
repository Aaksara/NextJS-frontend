# BookX frontend

Next.js 16 (App Router) frontend for the BookX student book exchange. It talks to the [Django backend](https://github.com/Aaksara/backend) and is an installable PWA with offline support and Web Push notifications.

The browser only talks to this Next.js server. Server actions call the Django API, and the JWTs are kept in `httpOnly` cookies, so page scripts never see them.

## Requirements

- Node.js 24 (see `.nvmrc`; 22.12+ works)
- pnpm 11 (`corepack enable` picks up the version pinned in `package.json`)
- Docker 24+ with Compose v2 (optional)

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm vapid:generate   # optional: paste the keys into .env.local
pnpm dev
```

Start the backend first (`docker compose up` in the backend repo), then open http://localhost:3000. Development emails, such as verification links, are printed in the backend's `web` container log.

The service worker only runs in production builds, because its asset caching gets in the way of hot reloading. To test install, offline and push features locally:

```bash
pnpm build && pnpm start
```

## Scripts

| Script                | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `pnpm dev`            | Start the dev server                         |
| `pnpm build`          | Production build (standalone output)         |
| `pnpm start`          | Serve the production build                   |
| `pnpm lint`           | ESLint, zero warnings allowed                |
| `pnpm typecheck`      | TypeScript type check                        |
| `pnpm format`         | Format with Prettier                         |
| `pnpm test`           | Unit tests (Vitest)                          |
| `pnpm check`          | Lint, typecheck, format check and tests      |
| `pnpm vapid:generate` | Generate a VAPID key pair for push messaging |

## Configuration

All configuration is read at runtime, so a single build or image can be promoted across environments. Variables are validated in `src/lib/env.ts`, and invalid values fail the request with a clear error.

| Variable            | Required | Description                                          |
| ------------------- | -------- | ---------------------------------------------------- |
| `API_URL`           | yes      | Django backend URL (default `http://localhost:8000`) |
| `VAPID_PUBLIC_KEY`  | no\*     | VAPID public key (base64url)                         |
| `VAPID_PRIVATE_KEY` | no\*     | VAPID private key (base64url). Keep secret           |
| `VAPID_SUBJECT`     | no\*     | Contact for push services: `mailto:` or `https:`     |
| `PORT`              | no       | Port the server listens on (default `3000`)          |

\* Push notifications are disabled when none are set. Setting only some of them is an error.

## Docker

The image uses a multi-stage build on `node:24-alpine`. It installs from the frozen lockfile and ships only Next.js standalone output, running as the unprivileged `node` user with a health check on `/api/health`.

```bash
docker compose up --build
```

Compose reads `.env` if it exists. It runs the container with a read-only root filesystem, all capabilities dropped and `no-new-privileges`.

To build and run without Compose:

```bash
docker build -t aksara-frontend .
docker run --rm -p 3000:3000 --env-file .env aksara-frontend
```

Serve it behind a TLS-terminating reverse proxy. Service workers and push only work over HTTPS (or `localhost`).

## Project structure

```
src/
  app/                  Routes, layout, manifest, offline page, /api/health
  features/
    auth/               Sign in/up, email verification, password reset, session cookies
    install/            Install prompt (beforeinstallprompt + iOS instructions)
    push/               Push subscription UI, server actions, store, web-push wrapper
    pwa/                Service worker registration
  lib/                  Env validation, backend API client, site config
  proxy.ts              Refreshes the access token before pages render
public/
  sw.js                 Service worker: offline fallback, static asset cache, push handling
  icons/
```

## Production notes

- **Subscription storage.** `src/features/push/subscription-store.ts` keeps subscriptions in memory, so they are lost on restart and not shared between replicas. Implement `SubscriptionStore` on top of a database or Redis before scaling out.
- **Backend.** Set `NUM_PROXIES` on the backend so its rate limits see the real client IP. This server forwards `X-Forwarded-For` from the TLS proxy, so browser → proxy → Next.js → Django is `1`. The backend's `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS` must point at this app's public URL.
- **Push.** Only signed-in users can subscribe, and the test notification only goes to the caller's own subscription.
- **Content Security Policy.** The CSP in `next.config.ts` allows `'unsafe-inline'` scripts because Next.js injects inline bootstrap code. For a stricter policy, generate a nonce per request in middleware.
- **Service worker updates.** Bump `CACHE_VERSION` in `public/sw.js` whenever the precache list or caching strategy changes.
