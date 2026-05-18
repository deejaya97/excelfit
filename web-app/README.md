# Excel Fit Admin Console

React + Vite admin console for Excel Fit Gym. Data is stored through Firebase SQL Connect and staff login uses Firebase Authentication.

## Firebase setup

1. Enable Email/Password sign-in in Firebase Authentication.
2. Create a staff user, for example `admin@excelfitgym.com`.
3. Deploy the SQL Connect schema and connector from the repo root:

```powershell
firebase deploy --only dataconnect
```

4. Optional: seed demo plans and members with `dataconnect/seed_data.gql` using the Firebase SQL Connect VS Code extension.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.
