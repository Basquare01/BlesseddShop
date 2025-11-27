const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const FLW_SECRET = process.env.FLW_SECRET; // Set this in your environment, do NOT commit secret keys
const PORT = process.env.PORT || 3000;

// Optional: verify webhook signature (if configured in Flutterwave dashboard)
function verifyWebhookSignature(body, signature) {
  if (!FLW_SECRET || !signature) return false;
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', FLW_SECRET).update(JSON.stringify(body)).digest('hex');
  return hash === signature;
}

app.post('/webhook/flutterwave', async (req, res) => {
  try {
    const signature = req.headers['verif-hash'] || req.headers['verif_hash'];
    console.log('Webhook received. Signature header:', Boolean(signature));

    // Uncomment to enforce signature verification if you configure webhook secret in dashboard
    // if (!verifyWebhookSignature(req.body, signature)) {
    //   console.warn('Invalid webhook signature');
    //   return res.status(400).send('Invalid signature');
    // }

    console.log('Webhook payload:', JSON.stringify(req.body));

    // TODO: inspect payload and update your orders DB here

    return res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).send('error');
  }
});

// Verify endpoint - attempts to verify by transaction id first, then by tx_ref query
app.get('/verify/:tx_ref', async (req, res) => {
  try {
    const tx_ref = req.params.tx_ref;

    if (!FLW_SECRET) {
      return res.status(500).json({ error: 'Server not configured with FLW_SECRET' });
    }

    // First try as transaction id
    const urlById = `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(tx_ref)}/verify`;
    let r = await fetch(urlById, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${FLW_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    if (r.status === 200) {
      const j = await r.json();
      return res.json({ method: 'by_id', result: j });
    }

    // Fallback: try verify by tx_ref query
    const urlByTxRef = `https://api.flutterwave.com/v3/transactions/verify_by_txref?tx_ref=${encodeURIComponent(tx_ref)}`;
    r = await fetch(urlByTxRef, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${FLW_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const j2 = await r.json();
    return res.json({ method: 'by_tx_ref', result: j2 });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'verification failed', details: String(err) });
  }
});

app.listen(PORT, () => console.log(`Flutterwave webhook/verify server listening on port ${PORT}`));
