# Regular — Subscription Management App

A subscription-based billing system for service businesses. Started as a
tool for barbers and stylists to manage recurring client plans, built to
generalize to any business that runs on regulars (gyms, studios, etc.).

## Stack

- **Backend:** Rust + [axum](https://github.com/tokio-rs/axum), in-memory
  shared state (no database yet)
- **Frontend:** Vite + React + TypeScript

## Project structure

```
backend/
  src/
    main.rs           # server setup, routing
    handlers.rs        # request handlers
    state.rs           # shared in-memory AppState
    user.rs            # User model + payload
    subscription.rs     # Subscription model + payload

frontend/
  src/
    api.ts             # typed fetch client for the backend
    components/
      Header.tsx / Header.css
      Hero.tsx   / Hero.css
      Footer.tsx / Footer.css
    theme.css           # shared design tokens (color, type, spacing)
```

## Running the backend

```bash
cd backend
cargo run
```

Set a custom port with `PORT=3001 cargo run`. Server prints its address
once bound.

### API

| Method | Path                              | Description                          |
|--------|-----------------------------------|---------------------------------------|
| GET    | `/api/health`                     | Health check                          |
| POST   | `/api/users`                      | Create a user                         |
| GET    | `/api/users/:id`                  | Fetch a user                          |
| GET    | `/api/users/:id/subscriptions`    | List a user's subscriptions           |
| POST   | `/api/subscriptions`              | Create a subscription for a user      |
| POST   | `/api/subscriptions/:id/cancel`  | Cancel a subscription                 |

User and subscription IDs are generated server-side (UUID v4) — do not
send `user_id` or `subscription_id` in create payloads.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in a `.env` file if the backend isn't on
`http://localhost:3000`.

## Status / next steps

- [x] User + subscription CRUD (create, read, cancel) with in-memory state
- [x] Frontend API client (`api.ts`)
- [x] Header, Hero, Footer components with a ledger/ticket-stub visual theme
- [ ] Replace `plan_name: String` with a `Plan` enum + server-side pricing
- [ ] Persist state to a real database (SQLite/Postgres via SQLx)
- [ ] Lock down CORS to the frontend's actual origin before deploying
- [ ] Pricing section / plan cards on the frontend
