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
- `components/ui/saa-s-template.tsx` — landing page nav + hero
- `components/auth/` — the auth form and the split auth layout
- `lib/actions/auth.ts` — server action that validates the sign-in / sign-up form
- `lib/stream-images.ts` — the Unsplash images shown in the corridor

## Authentication

No auth provider is connected yet: the form validates its fields on the server, then any
well-formed email and password redirect to `/`. Plug your provider's sign-in / sign-up call
into `lib/actions/auth.ts` where the `TODO` is.
