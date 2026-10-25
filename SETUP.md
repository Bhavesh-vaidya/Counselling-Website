# Razorpay & Deployment Setup

The site currently runs in **DEMO MODE**: the "Complete Booking (Demo)" button
simulates a payment, saves the booking to Firestore as `Demo - Not Paid`, and
shows the confirmation page. Nothing is charged.

## Run locally
```
npm install
npm run dev            # website
cd server && npm install && cp .env.example .env   # fill EMAIL_USER / EMAIL_PASS
node index.js          # backend on :5000 (contact form + Razorpay)
```

## Going live with Razorpay (when the account is ready)
1. Razorpay Dashboard -> Account & Settings -> API Keys -> generate **Test** keys first.
2. `server/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxx        # secret: server only, never in frontend
   ```
3. Project-root `.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx   # same KEY ID (public), NOT the secret
   VITE_API_URL=http://localhost:5000
   ```
4. Restart both. The Booking page now shows **Pay ₹1,500** and opens the real
   Razorpay window. Test with Razorpay's test UPI/card details.
5. Switch to `rzp_live_` keys after KYC activation.

## Deploy
- **Backend** (Express) needs a host (Render / Railway free tier). Set the same
  env vars there plus `CORS_ORIGIN=https://<username>.github.io`.
- **Frontend** (GitHub Pages): in GitHub -> Settings -> Secrets and variables ->
  Actions -> *Variables*, add `VITE_RAZORPAY_KEY_ID`, `VITE_API_URL` (your backend URL),
  `VITE_MEET_LINK`. Push to `main` and the workflow deploys.

## Prices
Amounts are unchanged. The server keeps a copy in `SERVICE_PRICES`
(`server/index.js`) and rejects any order whose amount doesn't match,
so if you ever change a price, change it in both places.
