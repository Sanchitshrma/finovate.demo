# Finovate paper-trading demo 📈

Finovate is a prototype for practicing a stock watchlist and simulated order flow. It uses virtual balances and demo portfolio records; it is not a brokerage service and does not send orders to an exchange. Prices can be delayed or simulated, and AI summaries are experimental, uncited, and not investment advice.

**🔗 Hosted preview:** [finovate-frontend.vercel.app](https://finovate-frontend.vercel.app/) (may not reflect the current source)

---

## ✨ Features

- 🔐 **Authentication** — Signup/login flow using JWT and bcrypt password hashing
- 📊 **Paper-trading dashboard** — Watchlist, simulated holdings, positions, and order history
- 💹 **Simulated Order Execution** — Buy/sell flow with automatic weighted-average cost-basis calculation on holdings
- ⭐ **Watchlist** — Add/remove stocks per user, backed by a unique index to prevent duplicates
- 🤖 **Experimental AI summary** — On-demand summary generated through the configured Gemini integration; output has no source citations and may be inaccurate
- 📈 **Price charts** — Historical price visualization with Chart.js; configured providers or simulated fallback may be used
- **AI output rendering** — AI-generated HTML is sanitized with DOMPurify before rendering

---

## 🏗️ Architecture

Finovate is split into **three independently deployable services**:

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│     frontend      │  JWT   │     dashboard      │  REST  │      backend       │
│  Landing, Signup,  │ ─────► │  Holdings, Orders,  │ ─────► │  Express + Mongo,   │
│  Login (Vercel)    │  URL   │  Watchlist, AI      │  API   │  JWT auth, Gemini   │
│                    │ handoff│  Insights (Vercel)  │        │  proxy (Render)     │
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

- **`frontend/`** — Public demo information and account screens. Successful sign-in redirects to the dashboard with a short-lived, single-use handoff code.
- **`dashboard/`** — The paper-trading demo: watchlist, holdings, positions, simulated orders, AI summary, and charts.
- **`backend/`** — Express REST API: authentication, demo order and holdings logic, and a proxy to the Gemini API.

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, React Router, Axios |
| Dashboard | React.js, Material UI, Chart.js, DOMPurify |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcrypt |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Market Data | Alpha Vantage / Finnhub (with simulated fallback) |
| Deployment | Vercel (frontend & dashboard), Render (backend) |

---

## 📁 Project Structure

```
Finovate/
├── frontend/        # Landing page + authentication
│   └── src/
│       ├── landing_page/
│       └── components/
├── dashboard/        # Trading dashboard (the core app)
│   └── src/
│       ├── components/
│       ├── services/     # stockService.js — live/simulated price data
│       └── utils/         # axios instance, gemini client
└── backend/           # REST API
    ├── models/
    ├── schemas/
    └── middleware/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/Finovate.git
cd Finovate
```

### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
MONGODB_URL=mongodb://127.0.0.1:27017/finovate
JWT_SECRET=replace_with_a_unique_random_secret
JWT_ISSUER=finovate-api
JWT_AUDIENCE=finovate-dashboard
JWT_EXPIRES_IN=1h
AUTH_HANDOFF_TTL_SECONDS=60
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
GEMINI_API_KEY=
```
Replace the JWT placeholder with a new secret (for example, generate one with `openssl rand -hex 32`). Set `CORS_ORIGINS` to the exact public frontend and dashboard origins before deployment. Start MongoDB before starting the backend. For Atlas, use a fresh database credential in this ignored `.env` file.
Run it:
```bash
npm start
```
Backend runs on `http://localhost:8000`.

### 3. Dashboard setup
```bash
cd dashboard
npm install
```
Create a `.env` file in `dashboard/`:
```env
PORT=3000
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_FRONTEND_URL=http://localhost:3001
REACT_APP_STOCK_API_PROVIDER=simulated
REACT_APP_ENABLE_SAMPLE_DATA=false
```
Do not put API secrets in `REACT_APP_*` variables; Create React App embeds them in browser JavaScript. To enable AI summaries locally, set `GEMINI_API_KEY` in `backend/.env` and restart the backend.
Run it:
```bash
npm start
```
Dashboard runs on `http://localhost:3000`.

### 4. Frontend setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/`:
```env
PORT=3001
REACT_APP_DASHBOARD_URL=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:8000
```
Run it:
```bash
npm start
```
Frontend runs on `http://localhost:3001`.

> Without a configured market-data key, the dashboard may fall back to generated demo prices. They are not suitable for financial decisions.

---

## 🔑 Key API Endpoints (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Authenticate and receive a JWT |
| `GET` | `/verify` | Validate the current JWT |
| `GET` | `/allHoldings` | Get the authenticated user's holdings |
| `GET` | `/allPositions` | Get the authenticated user's positions |
| `POST` | `/newOrder` | Record a simulated buy/sell order |
| `GET` | `/orders` | Get order history |
| `GET` / `POST` / `DELETE` | `/watchlist` | Manage the user's watchlist |
| `POST` | `/ai/insights` | Generate an experimental AI summary |

All routes except `/signup` and `/login` require an `Authorization: Bearer <token>` header.

---

## ⚠️ Prototype limits

- This project records simulated trades for demonstration purposes. It does not connect to a broker or exchange and does not accept deposits or enable withdrawals.
- Price data may be delayed or generated. AI output may be inaccurate, has no source citations, and is not investment advice.
- This repository has not completed a production security, privacy, reliability, or legal review. Do not enter real banking or brokerage credentials or reuse an important password.

---

## 🗺️ Production-readiness work still required

- Define product scope, data provenance, privacy policy, terms, and operational ownership.
- Add server-side validation, authorization review, abuse controls, observability, and backups.
- Add automated tests and CI for critical flows.
- Replace browser token storage with a reviewed httpOnly-cookie session design.
- Add source-grounded RAG only after establishing trusted, versioned source documents and evaluation criteria.

---

## 👤 Author

**Sanchit Sharma**

---

## 📄 License

No license file is included yet. Add a license before redistributing the project.
