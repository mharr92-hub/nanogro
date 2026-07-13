# Nano-Gro MVP Visual QA Results

Date: 2026-06-06

## Scope

Browser-based visual QA was run against the local production app served at `http://127.0.0.1:3001` using Microsoft Edge headless DevTools automation.

No new product features were added.

## Routes Checked

- `/`
- `/cases`
- `/diagnostico`
- `/admin/login`
- `/admin`
- `/admin/import`
- `/admin/review`
- `/admin/leads`

## Viewports Checked

- Mobile: `390px`
- Tablet: `768px`
- Desktop: `1440px`

## Themes Checked

- Nano Dark
- Nano Light

## Interaction Checks

- Theme toggle updates `data-theme` and persists the selected theme in `localStorage`.
- First visit without stored theme respects system preference; QA machine preferred dark, and the app initialized Nano Dark.
- Public navigation links are visible and usable on mobile, tablet, and desktop.
- `/cases` filters render and preserve query parameters.
- `/diagnostico` form renders visible labels and submit button.
- Admin protected routes redirect when unauthenticated.
- Admin routes were also checked with a QA admin cookie to inspect authenticated layouts.
- Import, review, and lead list layouts render in both themes.

## Issues Found

1. Admin layout caused page-level horizontal overflow on mobile.
   - Cause: fixed two-column admin shell at all viewport sizes.
   - Impact: `/admin`, `/admin/import`, and `/admin/leads` pushed content beyond the mobile viewport.

2. Admin login showed authenticated admin navigation before login.
   - Cause: `/admin/login` was wrapped by the shared admin layout.
   - Impact: login screen showed Dashboard, Import, Review, Leads, and Logout before authentication.

3. Mobile public/admin nav strips showed visible horizontal scrollbars.
   - Cause: intentionally scrollable nav rows used default browser scrollbar styling.
   - Impact: usable but visually noisy, especially in Nano Dark.

## Fixes Applied

- Updated the admin layout to stack on mobile and use the desktop sidebar only from `md` upward.
- Added `min-w-0` to the admin content column so wide tables stay contained in their own scroll cards.
- Hid the admin nav on `/admin/login` unless an admin session cookie exists.
- Kept middleware protection unchanged for authenticated admin routes.
- Added a reusable `scroll-strip` utility for horizontal nav rows.
- Applied `scroll-strip` to the public navbar and admin nav only.
- Preserved table scrollbars for dense admin tables.

## Remaining Concerns

- Admin import and lead tables still require horizontal scrolling on mobile/tablet. This is acceptable for dense admin data and is contained inside table cards.
- Public and admin mobile nav rows scroll horizontally when links exceed the viewport. The scrollbar is hidden, but the links remain accessible by swipe/trackpad.
- No full visual check was performed with real production Supabase data beyond the current mock/local data available in the app.

## Artifacts

- Screenshot folder: `docs/visual-qa-screenshots/`
- Machine-readable QA output: `docs/visual-qa-screenshots/visual-qa-results.json`
- Reproducible runner: `scripts/visual-qa-runner.mjs`

## Readiness Score

Visual readiness score: **92 / 100**

The MVP is visually ready for deploy after the mobile admin shell fix. The remaining deductions are for expected mobile horizontal scrolling in dense admin tables and lack of production-data visual validation.
