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

## Loading screen

Opening a language from the dashboard's works wheel (click the front card, press Enter, or
use "Open landing page") swaps to a full loading screen with a box loader, then on to the
language's particle logo:

1. **Wheel → loading screen.** The wheel sinks back and blurs away while the loader rises in.
   Only once the screen fully covers the page does the navigation start, so the next page loads
   out of sight.
2. **Loading screen → particles.** Once at least 2 seconds have passed **and** the work page's
   particle logo has drawn its first frame (or fallen back to the static image), the loader
   lifts off and the page settles into focus.

Both swaps are view transitions: the browser animates from a snapshot of one screen to the next.
The animations are in the "Loading screen swaps" section of `app/globals.css`; with
`prefers-reduced-motion` they only fade, and browsers without the View Transitions API simply cut.

The page underneath is `inert` and can't scroll meanwhile, and the screen announces
"Loading Python…" through a `role="status"` region. If the particles never report back (say the
user presses Back mid-load), the screen gives up after 10 seconds.

| File                                   | Role                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `components/ui/box-loader.tsx`         | The rolling cubes; styles and keyframes are in `app/globals.css`        |
| `components/ui/loading-overlay.tsx`    | The loading screen, its label and the screen reader announcement        |
| `hooks/use-loading-with-particles.ts`  | `showWhile(task, { minMs, label })`: loading until the task settles and `minMs` has passed |
| `lib/screen-transition.ts`             | `swapScreens()`: applies the loading on/off update as a view transition |
| `components/loading-provider.tsx`      | Keeps that state in the root layout so the screen outlives the dashboard route; exports `useLoading()` |
| `lib/particles.ts`                     | `waitForParticles()` / `signalParticlesReady()`: a window event between the two routes |
| `components/works/work-sculpture.tsx`  | Hands `signalParticlesReady` to the sculpture's `onReady` prop           |

The loading screen works for any other task too. Pass a promise, or a function to start the work
only once the screen covers the page:

```tsx
const { showWhile } = useLoading();
showWhile(saveDraft(), { label: "Saving" });
showWhile(() => { router.push("/next"); return pageReady(); }, { label: "Opening" });
```

To check it: `npm run dev`, open `/dashboard`, choose "Browse works" and click the Python card.
The cubes take the theme's text colour; set `--box-size` (one cube's edge, 64px on the loading
screen) or `--box-color` on a parent to resize or tint them.

## Design

Redesigned with the UI/UX Pro Max skill: Dark Mode (OLED) style, a monochrome palette so the
images carry the colour, DM Sans, 44px touch targets, visible focus rings, and motion limited to
the hero entrance and the corridor (both still under `prefers-reduced-motion`).

## Authentication

No auth provider is connected yet: the form validates its fields on the server, then any
well-formed email and password redirect to `/`. Plug your provider's sign-in / sign-up call
into `lib/actions/auth.ts` where the `TODO` is.
