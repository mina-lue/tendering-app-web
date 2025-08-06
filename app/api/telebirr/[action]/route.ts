import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const BASE = process.env.NEXT_PUBLIC_TELEBIRR_BASE_URL!;
const APP_KEY = process.env.NEXT_PUBLIC_TELEBIRR_APP_KEY!;
const APP_SECRET = process.env.NEXT_PUBLIC_TELEBIRR_APP_SECRET!;

async function getTelebirrToken() {
  // Telebirr “get token” spec may vary—adjust path/params as per docs
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(APP_KEY + timestamp)
    .digest('hex');

  const res = await fetch(`${BASE}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appKey: APP_KEY,
      timestamp,
      signature,
    }),
  });
  const json = await res.json();
  return json.access_token as string;
}

export default async function createOrder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { orderId, amount, description, callbackUrl } = req.body as {
    orderId: string;
    amount: number;
    description: string;
    callbackUrl: string;
  };

  try {
    const token = await getTelebirrToken();

    // Create payment order
    const orderRes = await fetch(`${BASE}/payments/v1/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        appKey: APP_KEY,
        outTradeNo: orderId,
        totalAmount: amount.toFixed(2),
        subject: description,
        callbackUrl,
      }),
    });
    const orderJson = await orderRes.json();

    if (!orderRes.ok) {
      throw new Error(orderJson.message || 'Failed to create Telebirr order');
    }

    // Telebirr returns either a QR code URL or a deep-link
    return res.status(200).json({
      qrUrl: orderJson.qrCodeUrl,       // (string)
      paymentUrl: orderJson.payUrl,     // (string)
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
