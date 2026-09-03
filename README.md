# Sharks Dashboard

Private, Arabic-first content operations dashboard for Sharks Agency. This application is a separate sibling of the deployed public website and manages the same Supabase content source without changing the public site's source code.

## Stack

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS 4 with a custom Sharks design system
- Supabase Auth, Postgres, Row Level Security and Storage
- React Hook Form and Zod validation
- TipTap structured rich-text editing
- Hugeicons and Sonner

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

The local dashboard runs on `http://localhost:4200`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | The same Supabase project URL used by `SharksAgencyWeb`. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The same public publishable key used by `SharksAgencyWeb`. |
| `NEXT_PUBLIC_SITE_URL` | Dashboard origin, used for auth callbacks. |
| `NEXT_PUBLIC_PUBLIC_SITE_URL` | Public website origin, used by article preview links. |

No service-role secret is required. Never expose a privileged key through `NEXT_PUBLIC_*`.

## Supabase architecture

The dashboard reuses all existing production content tables:

- `site_settings`, `services`
- `scenarios`, `scenario_steps`
- `blog_categories`, `blog_posts`
- `projects`, `project_gallery`
- `partners`, `team_members`
- `profiles`, `media_assets`
- Storage bucket `website-media`

The additive migration in `supabase/migrations` adds `dashboard_access`, a lightweight `dashboard_activity` audit table, secure registration/profile functions, and authorization-aware RLS helpers. It does not delete, rename, or reseed public content.

Apply the migration through a reviewed, linked Supabase CLI session:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Do not run `supabase db reset` against the production project.

## Auth and access model

Registration uses email and password but is invitation-only. The public `can_register_dashboard_user(email)` RPC returns only a boolean. A database trigger creates a content profile only when the new Auth email has an active access record. Dashboard access always requires both a valid Supabase session and an active `dashboard_access` row.

Roles:

- `owner`: full control, including owner/admin/editor access
- `admin`: content control and editor access management
- `editor`: content operations without access/security control

The migration allowlists `naderas109@gmail.com` as the initial owner. The owner chooses their own password at `/register`.

## Development and validation

```bash
npm run lint
npm run typecheck
npm run build
```

After applying the migration, validate registration, authorization and CRUD against a non-production branch or carefully reviewed production session. Public content is never seeded by this dashboard.

## Folder structure

```text
src/
  app/                 App Router pages and protected route groups
  components/          Sharks UI, auth, shell and preferences
  features/            Access, account, blog, entities and media workflows
  lib/                 Auth, entity contracts, Supabase clients and utilities
supabase/
  migrations/          Additive dashboard access and audit migration
```
