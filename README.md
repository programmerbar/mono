# Programmerbar Website

## Prerequisites

- [pnpm](https://pnpm.io/)
- [Node.js](https://nodejs.org/)

## How to run locally

1. Fill in env-variables

   ```bash
   cp apps/www/.env.example .env
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
- API will run on [http://localhost:8000](http://localhost:8000)

### Add invitation

To be able to login you need to create an invitation for yourself. You can do this by running the following command:

```bash
pnpm dlx tsx ./apps/www/scripts/add-invitation.ts "<your-email>"
```

## Technologies

The architecture heavliy relies on Cloudflare Pages and associated services like D1 and KV. The website is built with SvelteKit, and uses Sanity as a headless CMS.

### Deployment

The website will be deployed to Cloudflare Pages automatically when a PR is merged to `main`. Any migrations will also be applied to the production database automatically.

### Docker

To run the api with Docker use the following command:

```bash
docker run --env-file .env --network=host -p 8000:8000 programmerbar-api
```
