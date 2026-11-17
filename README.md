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

## Enquiry forms and email notifications

The shared contact form supports general/contact, personal-training,
membership, and free-trial enquiries. Contact and membership forms are
available on `/contact` and `/membership`; selecting the free-trial topic
reveals the requested date, time, and training interest fields.

Submissions go through the Next.js server route at `/api/forms`. The server
validates the request and forwards it to Google Apps Script; the script saves
the enquiry in Google Sheets before attempting an admin notification and
customer acknowledgement email. Google Sheets is the persistence layer in
this project; no separate database or admin dashboard is configured. Email
delivery results are tracked in the sheet, and the form does not claim an
email was delivered when Apps Script reports a failure.

Admins can reply by entering their response in the `Admin Reply` column in the
`Enquiries` sheet. An authorized Apps Script edit trigger sends the response,
records reply history, and suppresses repeat sends of an already delivered
reply. See the [Google Apps Script setup guide](./google-apps-script/README.md)
for spreadsheet setup, deployment, configuration, replying, and testing.

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
