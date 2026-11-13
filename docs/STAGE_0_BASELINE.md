# Stage 0 baseline

Date: 2026-10-31

## Repository and apps

- This workspace arrived without Git metadata. Stage 0 initializes a local Git repository and records the starting project.
- `frontend/`: React landing and account screens; local development port 3001.
- `dashboard/`: React paper-trading dashboard; local development port 3000.
- `backend/`: Express and MongoDB API; local development port 8000.
- No local `.env` files were present during the Stage 0 inventory. Use each app's `.env.example` as a variable-name reference and keep actual secrets in ignored `.env` files or the hosting provider's secret store.
- A credential-pattern scan found a Google API key-shaped value in the generated `dashboard/build` bundle. The generated build is excluded from the Git baseline. Treat that value as public: verify whether it is yours, then revoke/rotate or restrict it in the provider console before the next deployment. The source scan found no matching key in source files.

## Deployment references found

- Main site supplied for review: `https://finovate-frontend.vercel.app/`.
- The deployed homepage's demo link pointed to `https://finovate-seven.vercel.app/`; an unauthenticated visit redirected to the signup page.
- Source defaults point to `https://finovate-dashboard.vercel.app/` for the dashboard and `https://finovate-one.vercel.app/` for the frontend redirect.
- The source backend fallback is `https://finovate-uh8i.onrender.com`.
- Hosting environment variables may override these defaults. Reconcile the actual Vercel and Render settings before the next deployment; the templates use localhost values only.

## Baseline decisions

- Working product scope: paper trading and investing education only. See [PRODUCT_SCOPE.md](PRODUCT_SCOPE.md).
- No real-money trading, deposits, or brokerage claims are in scope.
- API keys belong on the backend. Existing `REACT_APP_*` client-key support is recorded as migration debt, not a recommended production setup.
