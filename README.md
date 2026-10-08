# demo-website

A dark SaaS landing page with an animated 3D image corridor, plus sign-in and sign-up pages.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui.

## Pages

| Route     | What it is                                                                 |
| --------- | -------------------------------------------------------------------------- |
| `/`       | Landing page: nav, gradient hero and the image corridor                    |
| `/login`  | Sign-in form beside the image corridor (corridor becomes a banner on phones) |
| `/signup` | Same layout with a name field and an 8-character password minimum           |

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project layout

- `components/ui/image-stream-hero.tsx` — the 3D image corridor (pure CSS animation, sized in `cqw`)
- `components/ui/saa-s-template.tsx` — the landing page: hero, corridor showcase, features, how it works, CTA, footer
- `components/landing/site-nav.tsx` — the fixed nav and mobile menu
- `components/auth/` — the auth form (shadcn Field + error summary) and the split auth layout
- `lib/auth-validation.ts` — validation rules shared by the form and the server action
- `lib/actions/auth.ts` — server action behind the sign-in / sign-up form
- `lib/stream-images.ts` — the Unsplash images shown in the corridor
- `app/globals.css` — theme tokens (pure black + white "Photography Studio" palette)

## Design

Redesigned with the UI/UX Pro Max skill: Dark Mode (OLED) style, a monochrome palette so the
images carry the colour, DM Sans, 44px touch targets, visible focus rings, and motion limited to
the hero entrance and the corridor (both still under `prefers-reduced-motion`).

## Authentication

No auth provider is connected yet: the form validates its fields on the server, then any
well-formed email and password redirect to `/`. Plug your provider's sign-in / sign-up call
into `lib/actions/auth.ts` where the `TODO` is.
