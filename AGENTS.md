# Repository Guidelines

## Project Structure & Module Organization

This pnpm workspace is orchestrated with Turbo (`turbo.json`) and shares lint/format rules via `base-prettier.config.mjs`. The SvelteKit app lives in `programmerbar-web`, with feature code under `src/`, UI assets in `static/`, and Cloudflare D1 migrations in `migrations/`. The Sanity Studio sits in `programmerbar-cms` (`schemaTypes/` for content models, `src/` for custom components). Transactional email layouts reside in `programmerbar-email-templates/templates/`, exported through the workspace package.

## Build, Test, and Development Commands

Install dependencies with `pnpm install`, then run `pnpm dev` to launch all persistent targets (web at 5173, Sanity at 3333). Use `pnpm --filter @programmerbar/web dev` or `... build` when iterating on a single app. Apply database migrations locally via `pnpm db:migrate:local`; production migrations run through `pnpm db:migrate`. `pnpm lint`, `pnpm check`, and `pnpm format:check` fan out through Turbo and should pass before opening a pull request.

## Coding Style & Naming Conventions

Prettier enforces tabs, double quotes, `printWidth` 100, and no trailing commas—run `pnpm format` to autofix. ESLint is configured per package with TypeScript and Svelte plugins; address warnings instead of silencing rules. Name Svelte components with PascalCase files, route directories in kebab-case, and shared utilities in camelCase. Keep email template filenames descriptive (`welcome-new-member.tsx`) and colocate schema helpers beside the Sanity schema they support.

## Testing Guidelines

`@programmerbar/web` uses Vitest for unit coverage (`pnpm --filter @programmerbar/web test:unit`) and Playwright for UI smoke tests (`... test:integration` under `programmerbar-web/tests/`). Add Vitest specs next to the code under test (`foo.test.ts`). There are no automated tests for the CMS or email templates yet—validate schema changes with `pnpm --filter @programmerbar/cms extract` and preview emails via `pnpm --filter @programmerbar/email-templates dev`.

## Commit & Pull Request Guidelines

Write imperative commit subjects, optionally using Conventional Commit prefixes (`feat(slack): add bar status handler`) as seen in the history. Keep commits scoped to a logical change and include follow-up commands run (e.g., `pnpm db:migrate`). Pull requests should describe the feature, link relevant issues, and call out schema or migration impacts; attach screenshots for UI work or links to preview emails. Before requesting review, ensure lint, type check, tests, and migrations have run locally.

## Environment & Security Notes

Copy environment defaults from `programmerbar-web/.env.example`, then fill secrets before starting services. Guard API keys by using `wrangler secret put` instead of committing `.env` changes, and prefer Vite `PUBLIC_` prefixes only for values safe to expose. D1 credentials live in Wrangler—coordinate schema changes before applying production migrations.
