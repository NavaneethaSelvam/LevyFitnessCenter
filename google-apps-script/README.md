# Levy Fitness Center enquiry integration

The website's shared contact form posts to Next.js `/api/forms`. The server
validates and forwards the request to this Apps Script Web App; the shared
secret is never sent to or included in frontend code. Apps Script writes each
enquiry to the `Enquiries` Google Sheet tab first, then attempts the admin
notification and customer acknowledgement using `MailApp`.

The Google Sheet is the enquiry persistence layer for this project. The
repository has no separate database or admin dashboard. Existing legacy tabs
(`Contact Enquiries`, `Membership Enquiries`, and `Trial Bookings`) are not
modified; new submissions use the unified `Enquiries` tab.

## 1. Create a Google Spreadsheet

1. Sign in to the Google account that should own and receive enquiries.
2. Create a spreadsheet, for example **Levy Fitness Center Enquiries**.
3. Copy the spreadsheet ID from its URL:

   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

The script creates an `Enquiries` tab with these required columns:

| Column | Purpose |
| --- | --- |
| Enquiry ID | Stable ID used to prevent duplicate submissions |
| Customer Name, Email, Phone | Customer contact information |
| Enquiry Type, Message | Enquiry category and submitted message |
| Submission Date, Status | Record date and processing state |
| Admin Reply | Enter an admin response here to email the customer |
| Email Delivery Status | Summary of admin and customer email delivery |

Additional columns store each email's individual status, trial/membership
details, reply history, reply delivery status, and a hidden reply deduplication
hash. Do not rename or reorder the columns. `initializeSheets` creates the
sheet and installs the edit trigger; it does not alter existing legacy tabs.

## 2. Create and authorize the Apps Script

1. In the spreadsheet, choose **Extensions → Apps Script**.
2. Replace the editor's `Code.gs` with the complete contents of this folder's
   [`Code.gs`](./Code.gs), then save.
3. In **Project Settings → Script Properties**, add:

   | Property | Value |
   | --- | --- |
   | `SPREADSHEET_ID` | The ID from the spreadsheet URL |
   | `API_SHARED_SECRET` | A new random secret with at least 32 bytes of entropy |
   | `ADMIN_EMAIL` | The fitness center address that should receive enquiries and replies |

   Keep the shared secret private. Do not put it in website code, a
   `NEXT_PUBLIC_` variable, or a committed file. Generate a secret locally, for
   example:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Choose `initializeSheets` in the function selector and click **Run**.
   Approve the requested spreadsheet and email permissions while signed in as
   the spreadsheet owner. This creates the `Enquiries` tab and installs the
   spreadsheet edit trigger used for admin replies.
5. Confirm the tab and header row exist. Confirm the installable trigger is
   listed under **Triggers** in Apps Script.

If a Google Workspace administrator blocks public web apps or Gmail sending,
ask them to allow the required deployment and authorization.

## 3. Deploy as a Web App

1. Choose **Deploy → New deployment**, then select **Web app**.
2. Set **Execute as** to **Me**.
3. Set **Who has access** to **Anyone** so the website server can call it
   without a Google sign-in. `Code.gs` validates the shared secret before
   changing data or sending mail.
4. Deploy and copy the Web app URL ending in `/exec`.

The unauthenticated `GET` health check reports the service name and whether
required Script Properties are present; it does not expose their values.
After code changes, deploy a new version of the Web App. The existing
deployment does not automatically use saved editor changes.

## 4. Configure the website

For local development, create `.env.local` in the repository root and set:

```dotenv
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_SHARED_SECRET=your-private-random-secret
```

Use the exact Web App URL and the same secret set as `API_SHARED_SECRET`.
`.env.local` is ignored by Git. Restart the development server after changing
environment variables.

For production, configure both variables as server-side environment variables
in the hosting provider and redeploy. Never prefix either variable with
`NEXT_PUBLIC_`. The checked-in `.env.example` contains blank placeholders only.

## 5. Admin replies

Open the `Enquiries` tab and enter a response in that row's `Admin Reply`
cell. The authorized edit trigger sends the response to the customer's email,
adds a timestamped entry to `Reply History`, sets `Reply Delivery Status`,
and updates the enquiry `Status`. Editing another column will not send a reply.
An identical reply already marked sent is not sent again. If a reply fails,
`Reply Delivery Status` is `failed`; after correcting the issue, select
`retryFailedReplies` in Apps Script and run it manually.

Only give spreadsheet edit access to staff permitted to view and reply to
customer enquiries. Anyone with edit access to the `Admin Reply` column can
cause an email to be sent to a listed customer.

## 6. Test and verify

After deployment and website configuration, submit test enquiries using
addresses and phone numbers you control:

1. Contact/general or personal-training enquiry from `/contact`.
2. Free-trial enquiry from `/contact`, including date, time, and training
   interest.
3. Membership enquiry from `/membership` and from a membership-plan link.
4. Check the `Enquiries` row, email delivery status, admin inbox, and customer
   acknowledgement inbox (including spam folders).
5. Enter a reply in `Admin Reply`, then verify the customer receives it and
   reply history/status are updated. Edit the same reply again to confirm it
   is not sent twice.
6. To test duplicate protection, replay the same request ID through the
   server route; it should return the existing record without adding a row or
   re-sending emails.
7. To test email failure handling, use a controlled test deployment where
   `MailApp.sendEmail` is made to fail while Sheets access remains authorized.
   Verify the enquiry remains saved and the failed delivery is shown in the
   sheet. Restore the normal mail function, deploy it, and run
   `retryFailedEnquiryEmails`; only failed deliveries are retried.

Email failures do not remove an enquiry. The website reports that the enquiry
was received but does not confirm delivery when Apps Script reports an email
failure. `retryFailedEnquiryEmails` retries only targets marked `failed` and
does not resend targets marked `sent`.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| “Online form submissions are not configured yet” | Set both server environment variables and restart/redeploy. |
| “The enquiry service URL is invalid” | Use the HTTPS Apps Script Web App URL ending in `/macros/s/.../exec`. |
| Authorization error | Match `GOOGLE_APPS_SCRIPT_SHARED_SECRET` exactly to `API_SHARED_SECRET`. |
| Apps Script says not configured | Set `SPREADSHEET_ID`, `API_SHARED_SECRET`, and `ADMIN_EMAIL` in Script Properties. |
| Service returns an invalid response | Check Web App access, deployment version, authorization, and Apps Script execution logs. |
| Missing sheet row | Confirm spreadsheet ID, run `initializeSheets`, and check script-owner edit permission. |
| Email status is failed | Check `ADMIN_EMAIL`, Apps Script email authorization/quota, and execution logs; then run `retryFailedEnquiryEmails`. |
| Reply is not sent | Confirm the installable edit trigger exists, enter the reply in the `Admin Reply` column, and check `Reply Delivery Status`. |
| Header validation error | Restore the `Enquiries` headers exactly; do not overwrite existing data. |

The shared secret protects the write endpoint but does not replace sensible
deployment and data-access controls. Restrict spreadsheet sharing to staff
who need the enquiry data.
