# Free deployment guide - Netlify

Everything (website + backend) runs on **Netlify's free plan**:
- the website            -> https://<your-site>.netlify.app
- the backend (/api/*)   -> a Netlify Function in `netlify/functions/api.mjs` (contact form,
                            booking emails + Meet links, Razorpay). Same address, nothing to sleep or wake.
- emails + Meet links    -> your Google script (HTTPS), no app password, no SMTP.

Why not the others? GitHub Pages forbids sites that mainly take payments/bookings, and Vercel's
free plan is non-commercial only. Netlify's free plan allows commercial use.

## Facts to know about the free plan
- **300 credits per month** cover builds, bandwidth and function calls. A small practice site stays
  well inside this. Check Netlify -> Usage now and then. If credits run out, the site pauses until the
  next month or you upgrade.
- **Functions stop after 10 seconds.** The booking call is designed for this: ONE request to your Google
  script creates the Meet link and sends both emails. If Google is ever slower than ~8.5 s, the site
  answers anyway ("your link will be emailed shortly") and the script finishes the job on Google's side.
- Your Google account can send about **100 emails/day** through the script (each booking = 2, each
  contact message = 2).
- Secrets live ONLY in Netlify's environment settings, never in the code or on GitHub.

## Step 1 - Update the Google script (adds booking + email sending)   ~5 min
1. Open script.google.com -> your **Anora calendar helper** project.
2. In the editor, copy your current line `const SECRET = '...';` somewhere safe.
3. Open `server/google-apps-script.gs` from this project, copy ALL of it, select everything in `Code.gs`,
   paste. Then replace the line `const SECRET = 'PASTE_A_LONG_RANDOM_TEXT_HERE';` with the line you copied.
   Do not touch any other line. **Ctrl+S**.
4. Function dropdown -> **authorize** -> **Run** -> Review permissions -> your account ->
   Advanced -> Go to Anora calendar helper (unsafe) -> **Allow** (one new permission: send email).
5. **Deploy -> Manage deployments -> pencil icon -> Version: New version -> Deploy.** The URL stays the same.
6. Open the `/exec` URL in a browser: you should see `"secretSet":true`.
7. On your computer, in `server/.env` add `EMAIL_TRANSPORT=script`, then run `npm run test-email`
   (a test mail arrives) and `npm run test-calendar` (prints a Meet link).
The URL, the secret and the existing actions are unchanged; only new actions were added.

## Step 2 - Put the code on GitHub   ~3 min
```
git add .
git commit -m "Move to Netlify: backend function, policies, Meet links, email via script"
git push
```
Check on github.com that `server/.env` is NOT in the repository (it is git-ignored).
You can delete `.github/workflows/deploy.yml` and `render.yaml`; they are unused.

## Step 3 - Create the Netlify site   ~10 min
1. Go to https://app.netlify.com -> sign up with GitHub (free).
2. **Add new site -> Import an existing project -> GitHub** -> choose the `Counselling-Website` repo.
3. Build settings are read from `netlify.toml` (build `npm run build`, publish `dist`). Leave them.
4. Open **Add environment variables** (or later: Site configuration -> Environment variables) and add:
   | Key | Value |
   |---|---|
   | `EMAIL_TRANSPORT` | `script` |
   | `GOOGLE_SCRIPT_URL` | your Apps Script `/exec` URL |
   | `GOOGLE_SCRIPT_SECRET` | your secret (tick "Contains secret values") |
5. Click **Deploy**. Wait for "Published".
6. Site configuration -> **Change site name** -> e.g. `anora-counseling` -> your address becomes
   https://anora-counseling.netlify.app

## Step 4 - Check the live site
- Open the site. Pages, images, footer policy links all work; refresh (F5) on /services works.
- Open `https://<your-site>.netlify.app/api/health` -> you should see
  `"emailConfigured":true` and `"googleMeetConfigured":true`.
- Send a message from the Contact page -> it arrives in anoracounselling@gmail.com, and the sender gets an auto-reply.
- Online booking shows "Online booking is opening soon" (this is intentional until you switch it on).

## Step 5 - Test a full booking on the live site (before anyone knows the address)
1. Netlify -> Site configuration -> Environment variables -> add `VITE_BOOKINGS_OPEN` = `true`
   -> Deploys -> **Trigger deploy -> Clear cache and deploy site**.
2. Make a demo booking with your own email. Expect: confirmation page with "Join Google Meet Session",
   the confirmation email with the same link, the booking email to anoracounselling@gmail.com, the event
   in Google Calendar at that date/time, and `bookings` + `slots` in Firestore.
3. Clean up: delete the test documents in Firestore (`bookings` and `slots`), delete the test event from
   Google Calendar. Then remove `VITE_BOOKINGS_OPEN` and redeploy to close booking again until Razorpay is live.

## Step 6 - Razorpay and going live
1. Sign up at razorpay.com (individual). In **Test mode** create API keys.
2. Netlify environment variables: add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (secret) and
   `VITE_RAZORPAY_KEY_ID` (the same key id, NOT the secret) and `VITE_BOOKINGS_OPEN` = `true`. Redeploy.
3. Test a payment with Razorpay's test cards/UPI (booking button now says "Pay ₹...").
4. Complete Razorpay activation/KYC. Website details to give (replace the domain with yours):
   - About us:  https://<site>.netlify.app/about
   - Contact us: https://<site>.netlify.app/contact
   - Pricing:   https://<site>.netlify.app/services
   - Terms:     https://<site>.netlify.app/terms
   - Privacy:   https://<site>.netlify.app/privacy
   - Refund & Cancellation: https://<site>.netlify.app/refund-policy
5. After approval switch the three Razorpay values to the `rzp_live_` keys and redeploy.

## Running on your own computer
```
npm run server     # terminal 1: backend on http://localhost:5000
npm run dev        # terminal 2: website on http://localhost:5173/
```
(The address is now http://localhost:5173/ - the old /Counselling-Website/ part is gone.)

## Optional hardening
- Google Cloud Console -> APIs & Services -> Credentials -> your Firebase **Browser key** ->
  Application restrictions -> Websites: add `https://<site>.netlify.app/*` and `http://localhost:5173/*`.
- Keep the Firestore rules from `firestore.rules` published.

## Troubleshooting
| Problem | Fix |
|---|---|
| `/api/health` shows a 404 | Netlify -> Functions tab must list `api`. Re-deploy; make sure `netlify.toml` and the `netlify` folder are in the repo. |
| `emailConfigured:false` | `EMAIL_TRANSPORT`, `GOOGLE_SCRIPT_URL`, `GOOGLE_SCRIPT_SECRET` missing in Netlify variables; redeploy after adding. |
| Contact form: "unauthorized" in function logs | Secret in Netlify differs from the one in the script, or you forgot "New version" after editing the script. |
| Build fails mentioning "secrets" | Keep `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml`; never put secrets in `VITE_` variables. |
| Booking page says link "will be emailed shortly" | Google was slow or failed; check your inbox and the business email (it says "NOT CREATED" if no link). Send the link manually. |
| Function logs | Netlify -> Logs -> Functions -> `api`. |
