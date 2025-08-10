import { NextRequest, NextResponse } from "next/server";
import { buildCreateOrderPayload } from "@/lib/telebirr";

const BASE = process.env.NEXT_PUBLIC_TELEBIRR_BASE_URL!;
const FRONTEND_BASE = process.env.NEXT_PUBLIC_BASE_URL!;

type Body =
  | { type: "SUBSCRIPTION"; amount?: number }
  | { type: "DOCUMENT"; amount: number; documentId: string };

export async function POST(req: NextRequest) {
  try {
    let body = (await req.json()) as Body;

    // 1) Validate payload
    if (body.type === "SUBSCRIPTION") {
      // Force 20 ETB for subscription (per your requirement)
      body = { type: "SUBSCRIPTION", amount: 20 };
    } else {
      if (!body.amount || !body.documentId) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
    }

    // 2) Generate your unique order id
    const outTradeNo = `ORD_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    // 3) Create Telebirr payload
    const subject =
      body.type === "SUBSCRIPTION"
        ? "Monthly Subscription (20 ETB)"
        : `Document Purchase (${body.amount} ETB)`;

    const notifyUrl = `${FRONTEND_BASE}/api/telebirr/notify`;
    const returnUrl = `${FRONTEND_BASE}/api/telebirr/callback?outTradeNo=${encodeURIComponent(
      outTradeNo
    )}&type=${body.type}${
      body.type === "DOCUMENT" ? `&documentId=${encodeURIComponent(body.documentId)}` : ""
    }`;

    const payload = buildCreateOrderPayload({
      outTradeNo,
      totalAmount: body.type === "SUBSCRIPTION" ? 20 : body.amount,
      subject,
      notifyUrl,
      returnUrl,
    });

    // 4) Call Telebirr "create order" endpoint
    // NOTE: Replace the path below with the real create-order endpoint from Telebirr docs.
    const res = await fetch(`${BASE}/payment/createOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: "Telebirr createOrder failed", detail: t }, { status: 502 });
    }

    const data = await res.json();
    // Expect Telebirr to return a payment URL or QR or form params.
    // In most flows, you’ll get a "paymentUrl" to redirect/open.
    const paymentUrl = data?.paymentUrl ?? data?.data?.paymentUrl;

    if (!paymentUrl) {
      return NextResponse.json({ error: "No paymentUrl in Telebirr response", data }, { status: 502 });
    }

    // You may also want to pre-create a pending record in your backend here (optional)
    // await fetch(`${process.env.BACKEND_URL}/payments/pending`, {...})

    return NextResponse.json({ paymentUrl, outTradeNo });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
