# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Programmerbar** is a Norwegian student bar website built as a monorepo using pnpm workspaces and Turbo. The system manages events, volunteer shifts, user authentication via Feide (Norwegian education SSO), and beer credit tracking. The architecture is built specifically for Cloudflare's ecosystem.

## Architecture

### Monorepo Structure
- `apps/www/` - Main SvelteKit application (primary codebase)
- `apps/cms/` - Sanity headless CMS for content management
- `internal/emails/` - React Email templates for notifications

### Technology Stack
- **Frontend**: SvelteKit 2.28 with Svelte 5, Tailwind CSS v4
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM 0.44
- **Auth**: Lucia v3 with Feide OAuth integration
- **Deployment**: Cloudflare Pages with automatic deployments
- **Email**: Resend API with React Email templates
- **CMS**: Sanity v4 for product/content management

### Service Architecture
The application uses a service layer pattern with dependency injection via SvelteKit `locals`. All services are available in `app.d.ts`:

- `userService` - User CRUD, role management (board/normal)
- `eventService` - Event creation and management
- `shiftService` - Volunteer shift scheduling and assignments
- `emailService` - Automated email notifications
- `beerService` - Product catalog and credit tracking
- `invitationService` - User invitation system
- `statusService` - KV-based status tracking
- `notificationService` - User notifications
- `groupsService` - User group management
- `banService` - IP banning for abuse prevention

## Development Commands

### Setup
```bash
# Copy environment variables
cp apps/www/.dev.vars.example apps/www/.dev.vars
# Fill in Resend API key, Feide OAuth credentials

# Install dependencies
pnpm install

# Apply local database migrations
pnpm db:migrate:local

# Start all development servers (website + CMS)
pnpm dev
```

### Common Tasks
```bash
# Development
pnpm dev                    # Start all services (website: :5173, CMS: :3333)

# Database
pnpm db:generate           # Generate migration from schema changes
pnpm db:migrate:local      # Apply migrations to local D1 database
pnpm db:migrate            # Apply migrations to production

# Code Quality
pnpm lint                  # ESLint + Prettier check
pnpm format                # Auto-format code
pnpm check                 # TypeScript + Svelte checks

# Testing
pnpm test:unit             # Vitest unit tests (apps/www)
pnpm test:integration      # Playwright e2e tests

# Build & Deploy
pnpm build                 # Build all packages
pnpm preview               # Local production preview
```

### Database Management
```bash
# Create user invitation (required for first login)
pnpm dlx tsx ./apps/www/scripts/add-invitation.ts "user@email.com"

# Generate fake users for development
pnpm dlx tsx ./apps/www/scripts/users.ts
```

## Database Schema (Drizzle ORM)

### Core Entities
- **users** - Authentication via Feide, roles (board/normal), beer credits
- **sessions** - Lucia auth sessions
- **events** - Event management with dates
- **shifts** - Volunteer shifts with user assignments and event relationships  
- **groups** - User groups and memberships
- **invitations** - User invitation system with expiration
- **notifications** - User notification delivery
- **claimedCredits** - Beer credit transaction tracking

### Key Relationships
- Users → Shifts (many-to-many via assignments)
- Events → Shifts (one-to-many)
- Users → Groups (many-to-many via memberships)
- Users ↔ Invitations (email-based matching)

## Authentication & Authorization

### Feide Integration
- **Provider**: Norwegian education federation SSO
- **Flow**: OAuth 2.0 with Arctic library
- **User Creation**: Automatic on first Feide login (requires invitation)

### Role-Based Access
- `normal` - Basic portal access, can volunteer for shifts
- `board` - Admin access to user management, event creation, reporting
- Route protection: `/portal/admin/*` requires board role

## Portal System

### User Portal (`/portal/`)
- Event browsing and shift volunteering
- Personal profile and notification management
- Beer credit tracking and claiming

### Admin Portal (`/portal/admin/`)
- User management (roles, credits, deletion)
- Event creation with shift scheduling
- Volunteer assignment and management
- System status and reporting

## Development Patterns

### Form Handling
Use SvelteKit's enhanced forms with `use:enhance` for AJAX submissions. Always call `invalidateAll()` after successful mutations to refresh data.

### Service Usage
Access services via `locals` in server actions/load functions:
```typescript
export const actions = {
  default: async ({ locals, request }) => {
    await locals.userService.updateUser(userId, data);
    return { success: true };
  }
};
```

### Database Migrations
- Schema changes: Edit `src/lib/db/schemas/index.ts`
- Generate migration: `pnpm db:generate`
- Apply locally: `pnpm db:migrate:local`
- Production migrations run automatically on deployment

### Email Templates
Email templates are in `internal/emails/src/templates/`. Use `EmailService` to send with proper rendering and delivery via Resend.

## Deployment

### Cloudflare Pages
- Automatic deployment on `main` branch merges
- Database migrations applied automatically
- Environment variables configured in Cloudflare dashboard
- Domain: `programmer.bar`

### Required Environment Variables
- `RESEND_API_KEY` - Email delivery service
- `FEIDE_CLIENT_ID` & `FEIDE_CLIENT_SECRET` - OAuth authentication
- Database credentials configured via Wrangler for D1 access

## Common Issues

### First-Time Setup
Users must have invitations created before they can log in via Feide. Use the invitation script after setting up the local environment.

### Service Dependencies
All services require database and auth initialization. Check `src/hooks.server.ts` for service dependency injection setup.

### Migration Failures
If migrations fail, check D1 database status in Cloudflare dashboard and ensure proper credentials in `drizzle.config.ts`.