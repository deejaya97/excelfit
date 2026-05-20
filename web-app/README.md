# Excel Fit Admin Console

React + Vite admin console for Excel Fit Gym. Data is stored in Neon PostgreSQL through a Firebase Functions API, and staff login uses the app API.

## Setup

1. Add the Neon connection string to `functions/.env` as `DATABASE_URL`.
2. Set `STAFF_EMAIL`, `STAFF_PASSWORD`, and `SESSION_SECRET` in `functions/.env`.
3. Run the Firebase Functions API and Vite app locally:

```powershell
cd ..\functions
npm.cmd install
npm.cmd run serve
cd ..\web-app
npm.cmd install
npm.cmd run dev
```

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Keep the Functions emulator running in another terminal so `/api` can reach Neon. Open `http://localhost:5173`.
