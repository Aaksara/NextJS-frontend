# AKSARA frontend

Next.js app for the [AKSARA backend](https://github.com/Aaksara/backend). All the rules
live in the backend. This app shows pages and calls the API.

Stack: Next.js, Tailwind CSS, shadcn/ui, lucide icons and sonner toasts.

## Run it

Start the backend first, then:

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Sign-up and password emails are printed in the backend terminal (`python manage.py runserver`).

## Configuration

| Variable              | Default                 | Description        |
| --------------------- | ----------------------- | ------------------ |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of the backend |
| `NEXT_PUBLIC_APP_ENV` | `development`           | Environment badge in the admin top bar |

The value is baked in at build time.

## Layout

```
src/app/                    pages (auth pages live under app/auth/)
src/app/providers.tsx       app-wide providers (toasts)
src/components/ui/          shadcn/ui components (button, card, input, label)
src/components/form/        AuthForm, FormInput
src/lib/api/api-client.ts   requestApi: calls the API with the Bearer token
src/lib/utils/              cn(), page helpers
src/services/               one service per backend area, e.g. auth.service.ts
src/hooks/                  shared React hooks (pagination, drag to reorder)
public/icons/               app icons
```

Add shadcn/ui components with `pnpm dlx shadcn@latest add <name>`.

## Calling the API

Put the calls for each backend area in a service in `src/services/`, and use
`requestApi` inside it:

```ts
await requestApi("/api/listings/");
await requestApi("/api/listings/", { body: values });
await requestApi("/api/listings/1/", { method: "PATCH", body: values });
await requestApi("/api/listings/1/images/", { body: new FormData(form) });
await requestApi("/api/listings/1/images/2/", { method: "DELETE" });
```

Login stores the access and refresh tokens in `localStorage`, and `requestApi` sends
`Authorization: Bearer <access>`. When a call returns 401, it refreshes the tokens once
and retries. Errors are thrown as `ApiRequestError`, with `message` and per-field `fields`.

Validation and permission rules belong in the Django API.

## Admin console

The super admin console lives at `/admin` in this same app and deploys with it. Sign in at
`/admin/login` with the platform's single super admin, created on the backend with
`python manage.py createsuperuser`. Any other account is turned away, and the API refuses
it too, so the console's screens are not the only guard.

```
src/app/admin/login/          sign-in page
src/app/admin/(console)/      routes behind the sign-in: components, banners, campus, students
src/components/admin/         console shell: sign-in gate, sidebar, top bar, page header
src/features/admin/<area>/    one folder per admin area:
  types.ts                      data shapes, as the API returns them
  service.ts                    the only file that calls the API
  queries.ts                    React Query hooks over the service
  constants.ts                  labels and badge tones
  components/                   the area's UI
```

React Query is provided by `src/app/admin/layout.tsx`, so the storefront does not load it.
The admin session is never "remembered": it ends when the browser closes.

## Scripts

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm type-check`, and
`pnpm check` (Biome, ESLint, TypeScript and Vitest).

## Deploy (Vercel)

Import this repo in Vercel (framework preset: **Next.js**) and set one environment
variable:

| Variable              | Value                                              |
| --------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | the backend URL, e.g. `https://aksara-api.vercel.app` |

It is baked in at build time, so redeploy after changing it. On the backend, set
`FRONTEND_URL`, `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to this app's URL.
