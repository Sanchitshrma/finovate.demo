# Stage 2: Security and configuration baseline

## Implemented

- Secrets stay in ignored `.env` files; public templates contain placeholders only.
- The backend requires `MONGODB_URL` and `JWT_SECRET` at startup.
- Helmet security headers, a 100 KB JSON request limit, explicit CORS origins, and API rate limits protect the API boundary.
- Account emails are normalized and uniquely indexed. New passwords require at least 10 characters with uppercase, lowercase, and number characters; password hashing uses bcrypt with 12 rounds.
- JWT access tokens are limited to one hour by default and include issuer, audience, and algorithm checks.
- Sign-up and sign-in return a short-lived, single-use handoff code. The dashboard exchanges that code for its access token, so a reusable JWT is no longer included in the redirect URL.
- API inputs for watchlist symbols, paper orders, and AI history are validated.
- Cross-user access through `GET /holdings/:userId` is rejected.
- Sample positions are disabled unless `ENABLE_SAMPLE_DATA=true` is set on the backend and `REACT_APP_ENABLE_SAMPLE_DATA=true` is set on the dashboard.

## Required deployment configuration

- Set `CORS_ORIGINS` to the exact public frontend and dashboard origins.
- Set a fresh, high-entropy `JWT_SECRET`.
- Keep `GEMINI_API_KEY`, database credentials, and all other secrets only in the host secret store.
- Ensure MongoDB can build the new unique index on `userdata.email` before enabling the release. Resolve duplicate normalized emails first if the database already contains them.

## Remaining security work

- Replace browser token storage with an httpOnly-cookie session architecture.
- Use a shared rate-limit store such as Redis when running more than one API instance.
- Add password-reset delivery and verification before exposing password-reset screens.
- Add dependency remediation, security tests, audit logging, monitoring, backups, and incident procedures.
