// File: app/subscribe/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// If you already have a backend base URL, you can use it here instead of API routes
// import { backend_url } from "@/lib/constants";

type Plan = "FREE_TRIAL" | "MONTHLY" | "YEARLY";

const plans: Array<{
  id: Plan;
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
}> = [
  {
    id: "FREE_TRIAL",
    title: "Free Trial",
    price: "Free for 7 days",
    description: "Try the platform with full access for one week.",
    features: ["Full access for 7 days", "Cancel anytime", "No Telebirr account required*"],
    cta: "Start Free Trial",
  },
  {
    id: "MONTHLY",
    title: "Monthly",
    price: "15 ETB / month",
    description: "Simple, low-cost monthly plan. pay with Telebirr.",
    features: ["All features", "see tender lists", "buy documents"],
    cta: "Subscribe",
  },
  {
    id: "YEARLY",
    title: "Yearly",
    price: "150 ETB / year",
    description: "Best value — save vs. monthly. pay with Telebirr.",
    features: ["All features", "better price", "Auto-renews yearly"],
    cta: "Subscribe",
  },
];

export default function SubscribePage() {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleStartTrial() {
    try {
      setLoadingPlan("FREE_TRIAL");
      setMessage(null);

      router.push('/tenders')

      // If you prefer to talk to your backend directly, replace with:
      // const res = await fetch(`${backend_url}/subscriptions/start-trial`, {
      const res = await fetch("/api/subscription/start-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "FREE_TRIAL" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to start trial");
      }

      setMessage("Your free trial is active! Redirecting to dashboard…");
      // Navigate user to the dashboard or refresh session
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (e: any) {
      setMessage(e.message || "Something went wrong");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handlePay(plan: Plan) {
    try {
      setLoadingPlan(plan);
      setMessage(null);

      

      const amount = plan === "MONTHLY" ? 15 : 150; // ETB

      // If you prefer to talk to your backend directly, replace with:
      // const res = await fetch(`${backend_url}/subscriptions/create-payment`, {
      const res = await fetch("/api/subscription/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, amount, currency: "ETB", provider: "telebirr" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to create payment");
      }

      const data = (await res.json()) as { paymentUrl?: string };
      if (data?.paymentUrl) {
        // Redirect user to Telebirr (or your payment page)
        window.location.href = data.paymentUrl;
      } else {
        setMessage("Payment created, but no redirect URL was provided.");
      }
    } catch (e: any) {
      setMessage(e.message || "Something went wrong");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-[80vh] w-full flex h-full items-center justify-center ">
      <div className="mx-auto max-w-6xl px-4 py-10 ">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-50">Choose your plan</h1>
          <p className="mt-2 text-gray-200">Free trial for one month, or subscribe monthly/yearly when you are ready.</p>
        </header>

        {message && (
          <div className="mx-auto mb-6 max-w-2xl rounded-xl border bg-white p-4 text-sm text-gray-800">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 text-green-800">
          {plans.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 flex flex-col">
              <div className="flex-1 justify-center text-center">
                <h2 className="text-xl font-bold">{p.title}</h2>
                <p className="mt-1 text-2xl font-bold">{p.price}</p>
                <p className="mt-2 text-gray-600">{p.description}</p>

                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-900" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {p.id === "FREE_TRIAL" ? (
                <button
                  onClick={handleStartTrial}
                  disabled={loadingPlan !== null}
                  className="mt-6 inline-flex items-center justify-center rounded-2xl border border-gray-900 bg-gray-900 px-4 py-2.5 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {loadingPlan === "FREE_TRIAL" ? "Starting…" : p.cta}
                </button>
              ) : (
                <button
                  onClick={() => handlePay(p.id)}
                  disabled={loadingPlan !== null}
                  className="mt-6 inline-flex items-center justify-center rounded-2xl border border-gray-900 bg-white px-4 py-2.5 text-gray-900 transition hover:bg-green-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {loadingPlan === p.id ? "Redirecting…" : p.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-200">* Depending on your payment setup, some regions/providers may still ask for verification.</p>
      </div>
    </div>
  );
}

// ------------------------------
// OPTIONAL: Example API routes (App Router)
// These are minimal stubs you can adapt to your backend/Telebirr flow.
// Place them under app/api/subscription/*
// ------------------------------

/*
// File: app/api/subscription/start-trial/route.ts
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { db } from "@/lib/db"; // your Prisma or DB util

export async function POST() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 1) Mark user as on-trial in your DB with 30-day expiry
    // await db.subscription.upsert({
    //   where: { userId: session.user.id },
    //   create: { userId: session.user.id, status: "TRIAL", trialEndsAt: addDays(new Date(), 30) },
    //   update: { status: "TRIAL", trialEndsAt: addDays(new Date(), 30) },
    // });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Failed to start trial" }, { status: 500 });
  }
}
*/

/*
// File: app/api/subscription/create-payment/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { plan, amount, currency, provider } = await req.json();

    if (!amount || !plan) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // TODO: Create payment on your backend (Telebirr integrate here)
    // - generate payment URL from Telebirr
    // - persist a pending Subscription/Invoice row
    // - return a URL to redirect the user

    // For now, return a placeholder URL (replace with real Telebirr URL you get back)
    const paymentUrl = `https://example.com/pay?plan=${plan}&amount=${amount}&currency=${currency || "ETB"}`;

    return NextResponse.json({ paymentUrl });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Failed to create payment" }, { status: 500 });
  }
}
*/
