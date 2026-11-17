# Levy Fitness Center

A responsive fitness-center website built with Next.js, React, and TypeScript.
It includes separate pages for the gym's programs, membership, trainers,
gallery, and contact information.

## Pages

| Page | Route |
| --- | --- |
| Home | `/` |
| About | `/about` |
| Programs | `/programs` |
| Membership | `/membership` |
| Trainers | `/trainers` |
| Gallery | `/gallery` |
| Contact | `/contact` |

## Requirements

- Node.js (LTS recommended)
- npm

## Run locally

From the project root:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Restart the development
server after changing `.env.local`.

The site has local defaults for its public business contact details. Set the
`NEXT_PUBLIC_BUSINESS_*` values in `.env.local` to override them.

## Build and type-check

```powershell
npm run typecheck
npm run build
npm start
```

`npm start` serves the production build after `npm run build`.

## Enquiry forms

The contact form supports contact enquiries, membership enquiries, and trial
booking requests. Form submissions are sent through the Next.js server route
at `/api/forms` to keep the Apps Script URL and shared secret out of browser
code.

Google Sheets submission is not active until the owner creates and authorizes a
spreadsheet, deploys the Apps Script Web App, and configures the server-side
environment variables. Follow the [Google Apps Script setup guide](./google-apps-script/README.md)
for the complete steps.

For local development, set these values in `.env.local` after deployment:

```dotenv
GOOGLE_APPS_SCRIPT_URL=
GOOGLE_APPS_SCRIPT_SHARED_SECRET=
```

For production, configure both as server-side environment variables in the
hosting provider. Never use a `NEXT_PUBLIC_` prefix for the shared secret. Do
not commit `.env.local` or other private credentials.

## Images and videos

Images are stored locally under `public/images/`; videos are under
`public/videos/`. Source and license notes for collected media are available in
[`public/images/gym/image-sources.txt`](./public/images/gym/image-sources.txt)
and [`public/videos/VIDEO-SOURCES.txt`](./public/videos/VIDEO-SOURCES.txt).

## Repository

The project repository is
[NavaneethaSelvam/LevyFitnessCenter](https://github.com/NavaneethaSelvam/LevyFitnessCenter).
Generated output, dependencies, local environment files, caches, and
credentials are excluded by `.gitignore`.
