# Programmerbar Monorepo

The monorepo for Programmerbar. Uses Cloudflare Pages to host the app.

## Development

### Prerequisites

- Node.js (v20)
- pnpm (v9)

### Setup

```bash
pnpm install
```

### Running the apps

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- CMS: http://localhost:3333
- Email preview: http://localhost:3000

## Apps

- `apps/web` - The frontend web app
- `apps/cms` - A Sanity Studio CMS

## Packages

- `packages/email` - React email components
