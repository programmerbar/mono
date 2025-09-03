# Programmerbar Website

## Prerequisites

- [pnpm](https://pnpm.io/)
- [Node.js](https://nodejs.org/)

## How to run locally

1. Fill in env-variables

   ```bash
   cp programmerbar-web/.env.example .env
   ```

1. Fill in the empty variables

1. Install dependencies

   ```bash
   pnpm install
   ```

1. Apply migrations

   ```bash
   pnpm db:migrate:local
   ```

1. Start the development server

   ```bash
    pnpm dev
   ```

- Website will run on [http://localhost:5173](http://localhost:5173)
- Sanity will run on [http://localhost:3333](http://localhost:3333)

### Add invitation

To be able to login you need to create an invitation for yourself. You can do this by running the following command:

```bash
pnpm dlx tsx ./programmerbar-web/scripts/add-invitation.ts "<your-email>"
```
