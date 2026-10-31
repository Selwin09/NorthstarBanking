# Northstar

A polished, responsive banking dashboard demo built with React, TypeScript, Redux Toolkit, TanStack Query, Material UI, React Hook Form, and Yup.

## Features

- Demo sign-in with protected routes and role-based user/admin navigation.
- Account overview with balances, spending activity, account cards, and recent transactions.
- Searchable, sortable, filterable transaction history with date range and pagination.
- Fund transfer form with Yup validation, balance checks, and live transaction updates.
- Cards page with an interactive freeze/unfreeze demo.
- Admin team overview and workspace member list.
- Responsive layouts for desktop, tablet, and mobile.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Run a production build with `npm run build`, or check types with `npm run typecheck`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Personal account | `demo@northstar.com` | `password` |
| Administrator | `admin@northstar.com` | `password` |

## Project structure

```text
src/
  app/                 Redux store and typed hooks
  data/mockApi.ts      In-memory mock API and seeded demo data
  features/auth/       Authentication state
  App.tsx              Routes, screens, and dashboard UI
  App.css              Responsive component styles
  types.ts             Shared application types
```

## Demo-only security note

Authentication and banking data are simulated in the browser. The demo token is not a real JWT, no real credentials or payments are processed, and this project is not suitable for production use. A production banking app must use a secure backend, real identity provider, server-side authorization, and compliant payment infrastructure.

## License

This project is provided as a portfolio starter. Add a license that matches your intended reuse before publishing.
