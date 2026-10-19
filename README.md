# BookX frontend

Next.js pages for the [BookX backend](https://github.com/Aaksara/backend). All the rules
live in the backend. This app only shows pages and calls the API.

## Run it

Start the backend first, then:

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Sign-up and password emails are printed in the backend log (`docker compose logs web`).

## Configuration

| Variable              | Default                 | Description        |
| --------------------- | ----------------------- | ------------------ |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of the backend |

The value is baked in at build time (`docker build --build-arg NEXT_PUBLIC_API_URL=...`).

## Layout

```
src/app/          one folder per page
src/components/   Form: posts its fields to an API endpoint and shows the errors
src/lib/api.ts    fetch wrapper: sends the auth cookies and refreshes them once on 401
public/icons/     app icons
```

The backend keeps the session in httpOnly cookies, so this app never handles tokens.
For the browser to send those cookies, the backend's `CORS_ALLOWED_ORIGINS` must list
this app's URL, and both apps must share a parent domain in production.

## Scripts

`pnpm lint`, `pnpm typecheck`, `pnpm format`, and `pnpm check` (runs all three).

## Docker

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t bookx-frontend .
docker run --rm -p 3000:3000 bookx-frontend
```
