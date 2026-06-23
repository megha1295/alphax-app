# AlphaX Frontend Assessment

A Next.js application implementing authentication, OTP verification, profile, product listing and cart flows, built against the DummyJSON public API.

## Tech stack

- Next.js 14, App Router
- TypeScript
- Tailwind CSS
- Zustand (with persist middleware for the cart)
- Axios

## Getting started

1. Install dependencies

```
npm install
```

2. Confirm `.env.local` exists in the project root with this value

```
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

3. Run the dev server

```
npm run dev
```

4. Open `http://localhost:3000`

## Test login

DummyJSON requires an existing seeded user, you cannot register a new one. Use the documented test account:

- Username: `emilys`
- Password: `emilyspass`

OTP screen accepts any 6 digit code except `000000`, which is rejected by design.

## Architecture

The app follows Clean Architecture, with a clear separation between business rules, real API calls, and UI.

```
src/
├── app/              Next.js pages and API routes (the only layer aware of Next.js itself)
├── domain/           Entities, repository contracts, and use cases. No dependency on
│                     Next.js, axios, or Zustand. Pure business rules.
├── data/             Real implementations: axios calls to DummyJSON, repository classes
│                     that fulfill the domain contracts, and the session cookie helper.
└── presentation/     Zustand stores and shared components (Navbar) used across screens.
```

- `domain/repositories` defines contracts only (e.g. `AuthRepository`), no implementation.
- `data/repositories` provides the real implementation (`AuthRepositoryImpl`) using the
  axios calls in `data/api`.
- `domain/usecases` holds business rules (password length validation, OTP rejection of
  `000000`) that call into the repository contract, independent of how that contract is
  fulfilled.

This means the DummyJSON-specific code could be swapped for a different backend by only
touching the `data` layer.

## Session and security

- The access token is stored in an **httpOnly cookie** (`alphax_session`), set via a
  Next.js route handler (`/api/session`). This keeps the token inaccessible to any
  JavaScript running in the browser, including malicious injected scripts (XSS), which
  is the main risk with storing tokens in `localStorage`.
- The cookie carries both the token and an `isVerified` flag, since a user can have a
  valid token from Login but not yet have completed OTP. Only `isVerified: true` counts
  as a fully authenticated session.
- Profile data is fetched through a server-side route (`/api/profile`) that reads the
  cookie and calls DummyJSON directly from the server. The access token is never sent
  back to the browser at any point after login.
- `src/middleware.ts` runs before every request to `/profile`, `/products`, and `/cart`,
  checking the cookie and redirecting to `/login` if it's missing, unverified, or
  corrupted.
- Cart data is intentionally stored differently, via Zustand's `persist` middleware into
  `localStorage`, since it is not sensitive and the brief requires it to survive a page
  refresh.

## Screens

| Screen | Notes |
|---|---|
| Login | Required field and minimum password length validation, real-time password hint, loading state on submit, error feedback for invalid credentials |
| OTP | Auto-advancing 6-digit input, backspace navigation, 60s resend countdown, rejects `000000`, simulated 1s verify delay |
| Profile | Fetches the current user server-side, loading and error states with retry, avatar with initials fallback, logout |
| Products | Fetches DummyJSON products, client-side title search, responsive grid, add to cart |
| Cart | Quantity controls, automatic removal at zero quantity, explicit remove, clear cart, persists across refresh |

## Edge cases handled

- Network timeout: the shared axios client has an 8 second timeout, so a slow or hung
  request fails into the existing error/retry UI rather than spinning indefinitely.
- Invalid or missing session: middleware redirects to `/login`; a corrupted cookie value
  is caught and treated as logged out rather than throwing.
- Empty cart and empty product search results both show an explicit message rather than
  a blank screen.

## Known limitations / what I'd do next with more time

- No automated tests, in line with the brief's note that test coverage isn't required
  for this time window.
- Shared UI primitives (Button, Input) were not extracted into their own components;
  each screen currently styles its own form elements directly with Tailwind. With more
  time I'd factor these out for consistency.
- Logout does not currently clear the cart. Given DummyJSON has no real user-specific
  cart data, this was a deliberate scope decision, worth discussing tradeoffs on.