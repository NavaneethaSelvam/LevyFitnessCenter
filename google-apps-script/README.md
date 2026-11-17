# Levy Fitness Center enquiry forms

This folder contains the Google Apps Script endpoint used by the website's
contact, membership, and trial-booking forms. The project is not connected to a
live spreadsheet until the owner completes the setup and deploys the script.

The browser posts to the Next.js endpoint at `/api/forms`. The Next.js server
forwards validated submissions to Google Apps Script, so the deployment URL
and shared secret stay server-side and are never exposed in browser JavaScript.

## 1. Create a Google Spreadsheet

1. Sign in to the Google account that should own and receive the enquiries.
2. Create a new Google Spreadsheet, for example **Levy Fitness Center Enquiries**.
3. Copy the spreadsheet ID from its URL:

   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

The script creates and maintains these tabs:

- `Contact Enquiries`
- `Membership Enquiries`
- `Trial Bookings`

Each tab receives its header row automatically. Do not rename or reorder those
headers after setup.

## 2. Create and authorize the Apps Script

1. In the spreadsheet, select **Extensions → Apps Script**.
2. In the Apps Script editor, open `Code.gs`, remove its starter content, and
   paste the complete contents of this folder's `Code.gs`.
3. Save the project.
4. Open **Project Settings → Script Properties → Add script property** and add:

   | Property | Value |
   | --- | --- |
   | `SPREADSHEET_ID` | The ID copied from the spreadsheet URL |
   | `API_SHARED_SECRET` | A new, randomly generated secret with at least 32 bytes of entropy |

   Keep the secret private. Do not put it in website code, a `NEXT_PUBLIC_`
   variable, or a committed file. Generate a different secret for each
   deployment. For example, generate one locally with:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Copy it directly into Script Properties and the server-side environment;
   do not paste it into source files or chat.
5. In the function selector, choose `initializeSheets` and click **Run**.
   Review and approve the requested Google Sheets authorization. This creates
   the three tabs and their headers.
6. Confirm all three tabs exist in the spreadsheet.

If the Google Workspace administrator blocks public web apps, ask the
administrator to allow the required deployment access before continuing.

## 3. Deploy as a Web App

1. In Apps Script, choose **Deploy → New deployment**.
2. Select the gear icon and choose **Web app**.
3. Set **Execute as** to **Me** so rows are written using the spreadsheet
   owner's authorization.
4. Set **Who has access** to **Anyone** so the website server can call the web
   app without a Google sign-in. The shared secret is checked by `Code.gs`
   before any sheet is changed.
5. Click **Deploy**, complete any authorization prompt, and copy the Web app
   URL ending in `/exec`.

The deployment URL is configuration, not a credential. The shared secret is
private. If `Code.gs` changes later, create a new version and update the
deployment to use it.

## 4. Configure the website

For local development, create a root-level `.env.local` (do not replace
`.env.example`) and set:

```dotenv
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_SHARED_SECRET=your-private-random-secret
```

Use the exact Web app URL and the same secret stored in Apps Script's
`API_SHARED_SECRET` property. `.env.local` is ignored by Git. Restart `npm run
dev` after changing environment variables.

For a hosted site, configure both variables in the hosting provider's
**server-side environment settings**, then redeploy. Never prefix either
variable with `NEXT_PUBLIC_`. `.env.example` contains the variable names only.

## 5. Test each form

After configuration, start the site and submit each form with test data you
control. Verify the resulting row in the corresponding sheet tab:

1. **Contact:** on `/contact`, enter a name, email, phone, subject, and message.
2. **Membership:** on `/membership`, choose a plan and send the membership
   enquiry. A plan selected from a pricing-card link is preselected.
3. **Trial booking:** on `/contact`, choose **Trial booking** as the subject,
   then enter a preferred date, time, and training interest.

The existing project did not have a separate trial-booking form. The contact
form now exposes trial booking as a subject and displays the required date,
time, and interest fields while retaining the existing form and page layout.

The form displays success only after Apps Script confirms a row was saved (or
confirms that the same submission was already received). If the endpoint is
not configured or a request fails, the form displays an error instead. Do not
consider the integration live until these test rows are visible in Sheets.

## 6. Data and duplicate handling

- Each operation writes to its own tab with a submission timestamp.
- Required fields and basic email, phone, date, and time formats are validated
  by both the website server and Apps Script.
- A submission ID is retained across retries of the same form values. Apps
  Script uses a script-wide lock and a six-hour cache to avoid adding the same
  submission twice.
- User text that could be interpreted as a spreadsheet formula is stored as
  plain text.
- Form contents and secrets are not written to application logs.

## Common errors

| Message or symptom | What to check |
| --- | --- |
| “Online form submissions are not configured yet” | Set both variables in `.env.local` or the hosting environment, then restart/redeploy. |
| “The enquiry service URL is invalid” | Use the HTTPS Apps Script Web app URL ending in `/macros/s/.../exec`. |
| “The enquiry service authorization failed” | Ensure `GOOGLE_APPS_SCRIPT_SHARED_SECRET` exactly matches `API_SHARED_SECRET` in Script Properties. |
| “The enquiry service has not been configured” | Set `SPREADSHEET_ID` and `API_SHARED_SECRET` in Apps Script Script Properties, then run `initializeSheets`. |
| “The enquiry service returned an invalid response” | Check that the deployment is accessible as **Anyone**, executes as **Me**, and that the latest `Code.gs` version is deployed. |
| A sheet tab or row is missing | Confirm the spreadsheet ID, run `initializeSheets`, and check that the Apps Script owner can edit the spreadsheet. |
| “The target sheet headers need to be restored” | Restore the exact header row documented in `Code.gs`; the script will not overwrite mismatched headers or existing data. |
| Deployment or authorization is blocked | Check Google Workspace administrator policies and approve the spreadsheet authorization while signed in as the owner. |

The endpoint is proxied through the site's server to avoid browser CORS
limitations. A public web-app deployment should still be monitored for unusual
traffic; the shared secret prevents direct unauthenticated writes to the
spreadsheet. Restrict spreadsheet sharing to staff who need access to enquiry
data.
