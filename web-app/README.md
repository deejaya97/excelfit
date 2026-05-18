# Excel Fit Admin Console

React + Vite admin console for Excel Fit Gym. Data is stored in Cloud Firestore and staff login uses Firebase Authentication.

## Firebase setup

1. Enable Email/Password sign-in in Firebase Authentication.
2. Create a staff user, for example `admin@excelfitgym.com`.
3. Create a Cloud Firestore database for the `excelfit-c87bf` project.
4. Deploy Firestore rules from the repo root:

```powershell
firebase deploy --only firestore:rules
```

5. Optional: add demo plans and members from the app UI after logging in.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.
