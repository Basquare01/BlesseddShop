# BlessedShop - Flutterwave webhook & verify server

This is a tiny Node/Express example to receive Flutterwave webhooks and verify transactions server-side.

Important: Do NOT commit your secret key. Use environment variables.

Setup

1. Install dependencies

PowerShell:

```powershell
cd server
npm install
```

2. Create `.env` from the example and set your secret key

```powershell
cd server
Copy-Item .env.example .env
# then open .env and replace FLW_SECRET with your FLWSECK_TEST value
```

Or set env var directly in PowerShell for testing:

```powershell
$env:FLW_SECRET="FLWSECK_TEST-6b4bca2e4f8349d46212db5bbb7f9457-X"
node index.js
```

Run server

```powershell
cd server
node index.js
```

Expose locally with ngrok (recommended for testing):

1. Download ngrok from https://ngrok.com and sign up for an account.
2. Run ngrok on the port the server is listening on (default 3000):

```powershell
ngrok http 3000
```

3. Note the HTTPS forwarding URL (for example `https://abc123.ngrok.io`).
4. In the Flutterwave dashboard, add the webhook URL:

```
https://abc123.ngrok.io/webhook/flutterwave
```

Testing flow

- Use the client-side Test Public Key in `js/payment.js` (already set in this project).
- Make a test payment in the browser (with the Flutterwave modal). Flutterwave will POST webhook events to `/webhook/flutterwave`.
- You can also verify a transaction manually via the `/verify/:tx_ref` endpoint by passing the `tx_ref` or transaction id.

Security notes

- Never expose your `FLWSECK` secret key in client-side code or commit it to the repo.
- Use HTTPS for webhook endpoints in production.
- Validate webhook signatures when possible.

If you want, I can also wire the client to call `/verify/:tx_ref` after the payment callback to confirm the transaction server-side and mark the order completed only after verification.
