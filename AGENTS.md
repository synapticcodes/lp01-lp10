# AGENTS.md — coding-agent instructions

This repository maintains **10 landing page variants** on the same Netlify site, with stable URLs:

- Primary slugs: `/lp01` … `/lp10`
- Legacy slugs: `/lp-01` … `/lp-10` (redirected)

The layout/component base is shared; **what changes per variant** is mainly **copy** and **the lead form**.

## Communication rule (hard requirement)

- Always respond **only in Portuguese (pt-BR)** in all assistant messages (even if files/instructions are in English).

## Dev environment tips

- Stack: **Vite + React + TypeScript + React Router + Tailwind + shadcn/ui**.
- Install: `npm i`
- Dev server: `npm run dev`
- Build: `npm run build` (or `npm run build:dev` for a development-mode build)
- Preview build: `npm run preview`
- Lint: `npm run lint`

## Where to change things (common flows)

- **Edit LP copy (lp01…lp10)**: `src/content/lpVariants.ts`
  - There is a `base` object (default), and `landingVariants.lp01...lp10` overrides only what changes.
  - `getLandingVariant(key)` normalizes the key and provides a safe fallback to `lp01`.
- **Reorder/change landing sections**: `src/pages/Landing.tsx`
  - Sections receive their copy via props (e.g. `copy.hero`, `copy.faq`).
- **Change the layout/UX of a specific section**: `src/components/sections/*`
- **Variant-specific lead form**: `src/forms/lead/variants/lp01.tsx` … `src/forms/lead/variants/lp10.tsx`
  - Variants usually delegate to the default; to truly customize, implement the variant component while keeping the `LeadFormVariantProps` contract.

## How routes and variants work

- Routes (primary + legacy) live in `src/App.tsx`.
- Netlify redirects and the SPA fallback live in `netlify.toml`:
  - `/` → `/lp01`
  - `/lp-01`…`/lp-10` → `/lp01`…`/lp10` (301)
  - `/*` → `/index.html` (200) for React Router

## Lead forms (selected by URL)

- The dialog “shell” selects the form by URL in `src/components/ui/LeadFormDialog.tsx`.
- The variant → component mapping lives in `src/forms/lead/registry.ts`:
  - `getLeadFormVariantFromPath(pathname)` supports `/lp01` and `/lp-01`
  - `getLeadFormComponentForPath(pathname)` resolves the correct component
- The default flow/validation/submission lives in `src/forms/lead/DefaultLeadFormDialogContent.tsx`.
  - Resubmission protection: `localStorage.leadSubmitted`
- **Regra de IDs nos inputs (obrigatório em qualquer formulário/variante)**:
  - Nome: `id="name"`
  - WhatsApp: `id="phone"`
  - E-mail: `id="email"`
  - Referência centralizada: `src/forms/lead/fieldIds.ts`

## Integrations and env vars (DO NOT commit secrets)

- Copy `.env.example` to `.env` and fill:
  - `VITE_AIRTABLE_TOKEN` (required)
  - `VITE_AIRTABLE_BASE_ID` (required)
  - `VITE_AIRTABLE_TABLE_NAME` (optional, defaults to `Leads`)
  - `VITE_WHATSAPP_VALIDATOR_APIKEY` (optional)
  - `VITE_WHATSAPP_VALIDATOR_URL` (optional)
- Airtable: `src/hooks/useAirtableSubmission.ts` reads `import.meta.env.*` and fails gracefully when config is missing.
- WhatsApp: `src/hooks/useWhatsappValidation.ts` is optional; without an API key, validation is skipped.

## Back button behavior (“last chance”)

- There is an abandonment-reduction redirect when the user tries to go back without submitting:
  - Hook: `src/hooks/useBackButtonRedirect.ts`
  - Applies only on `/lp01..lp10` and `/lp-01..lp-10` when `localStorage.leadSubmitted` is not set.

## Critical files (change with EXTREME care)

- `src/App.tsx` (routes/slugs): mistakes cause 404s or wrong variants.
- `netlify.toml` (redirects + SPA fallback): changes can break SPA routes and legacy compatibility.
- `src/forms/lead/registry.ts` (regex/mapping): can select the wrong form (or always fall back to default).
- `src/components/ui/LeadFormDialog.tsx` (form router): can break the modal.
- `src/hooks/useBackButtonRedirect.ts` (regex): can enable/disable redirect unexpectedly.
- `src/hooks/useAirtableSubmission.ts` (lead capture): changes require manual validation.
- `index.html` (GTM): avoid touching scripts/measurement unless necessary.

## Quick checklist before finalizing

- If you changed copy/UX: verify `/lp01` and the target variant (`/lp0X`) via `npm run dev`.
- If you changed routing/redirects: verify `/lp-0X` redirects to `/lp0X` (and SPA fallback works).
- Run `npm run lint` and `npm run build` before opening a PR/merging.

## PR instructions

- Keep existing slugs (`/lp01..lp10`) and legacy redirects working.
- Do not introduce tokens/keys into code; use only `import.meta.env.*`.
- Prefer small, focused changes: copy in `src/content/lpVariants.ts`, per-LP forms in `src/forms/lead/variants/*`.
