import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_TELEBIRR_BASE_URL!;

/**
 * When the user returns from Telebirr, we verify the order status with Telebirr,
 * then redirect the user to a success/failure page.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const outTradeNo = searchParams.get("outTradeNo");
    const type = searchParams.get("type");            // SUBSCRIPTION or DOCUMENT
    const documentId = searchParams.get("documentId");

    if (!outTradeNo) {
      return NextResponse.redirect(new URL("/payment/error?reason=missing-order", req.url));
    }

    // 1) Query Telebirr for order result (replace with exact query endpoint)
    const res = await fetch(`${BASE}/payment/queryOrder?outTradeNo=${encodeURIComponent(outTradeNo)}`);
    const data = await res.json();

    const tradeStatus = data?.tradeStatus ?? data?.data?.tradeStatus;
    const totalAmount = Number(data?.totalAmount ?? data?.data?.totalAmount ?? 0);
    const providerRef = data?.tradeNo ?? data?.data?.tradeNo ?? "";

    // 2) Persist to backend (idempotent)
    const backendRes = await fetch(`${process.env.BACKEND_URL}/payments/telebirr/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outTradeNo,
        provider: "telebirr",
        providerRef,
        amount: totalAmount,
        currency: "ETB",
        status: tradeStatus, // backend should normalize
        meta: { type, documentId },
      }),
    });

    // 3) Redirect user to a page in your app
    if (tradeStatus === "SUCCESS") {
      return NextResponse.redirect(
        new URL(
          `/payment/success?type=${encodeURIComponent(type || "")}${
            documentId ? `&documentId=${encodeURIComponent(documentId)}` : ""
          }`,
          req.url
        )
      );
    } else {
      return NextResponse.redirect(new URL(`/payment/failed?order=${outTradeNo}`, req.url));
    }
  } catch (e) {
    return NextResponse.redirect(new URL("/payment/error?reason=exception", req.url));
  }
}
