import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// If Telebirr signs notify payloads, verify here with your APP_SECRET/public key.
// This is the authoritative signal for payment success.

function verifyTelebirrSignature(body: Record<string, any>) {
  // TODO: implement exactly as per Telebirr docs.
  // Example placeholder:
  const { sign, ...rest } = body;
  const sorted = Object.keys(rest).sort();
  const base = sorted.map(k => `${k}=${rest[k]}`).join("&") + process.env.TELEBIRR_APP_SECRET!;
  const expected = crypto.createHash("md5").update(base, "utf8").digest("hex");
  return expected === sign;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1) Verify signature
    const ok = verifyTelebirrSignature(body);
    if (!ok) {
      return NextResponse.json({ error: "Bad signature" }, { status: 400 });
    }

    // 2) Parse important fields from Telebirr notification
    const outTradeNo = body.outTradeNo;
    const totalAmount = Number(body.totalAmount);
    const tradeStatus = body.tradeStatus; // e.g., SUCCESS/CLOSED/etc.
    const providerRef = body.tradeNo || body.transactionId || ""; // Confirm exact field
    const currency = "ETB";

    // 3) Derive your type and any metadata you passed (you can encode in outTradeNo or pass attach field)
    // If you passed custom data, read it here. Otherwise, you can look up by outTradeNo in your DB.
    // For a simple approach we’ll POST to backend with status and the outTradeNo only.

    // 4) Persist to your backend
    const backendRes = await fetch(`${process.env.BACKEND_URL}/payments/telebirr/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outTradeNo,
        provider: "telebirr",
        providerRef,
        amount: totalAmount,
        currency,
        status: tradeStatus, // normalize to "SUCCESS"|"FAILED" in backend
        raw: body,           // store raw for audit
      }),
    });

    if (!backendRes.ok) {
      const t = await backendRes.text();
      // Telebirr expects a 200 from you; still return 200, but log the problem.
      console.error("Backend failed to save payment:", t);
    }

    // 5) Respond 200 so Telebirr stops retrying
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // Still return 200 to avoid infinite retries, but log it
    console.error("Notify error:", e);
    return NextResponse.json({ ok: true });
  }
}
