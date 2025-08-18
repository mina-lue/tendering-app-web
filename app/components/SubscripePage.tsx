// File: app/subscribe/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuPackage } from "react-icons/lu";

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
            <div className="rounded-2xl p-6 shadow-sm ring-1 ring-gray-00 flex flex-col bg-gray-200">
              <div className="flex-1 justify-center text-center">
                <h2 className="text-xl font-bold">Free Trial</h2>
                <p className="mt-2 text-gray-600">Try our service for free for 14 days.</p>

              <div className="flex items-center justify-center mt-2 mx-4">
                <div className="h-60 w-60 rounded-full bg-gray-300 flex items-center justify-center shadow-gay-400 shadow-xl">
                <p className="text-5xl font-bold">ETB 0.00</p>
                </div>
              </div>

              </div>
                <button
                  onClick={handleStartTrial}
                  disabled={loadingPlan !== null}
                  className="mt-6 text-2xl inline-flex items-center justify-center rounded-2xl  bg-gray-300 px-4 py-2.5 shadow-gay-400 shadow-lg transition hover:bg-green-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  Subscribe
                </button>
            </div>


             <div className="rounded-2xl bg-emerald-800 p-6 ring-1 ring-green-800 flex flex-col h-120 shadow-green-800 shadow-2xl">
              <div className="flex-1 justify-center text-center">
                <h2 className="text-xl font-bold text-gray-200">Monthly Pack</h2>
                <p className="mt-2  text-gray-200">Monthly Recurring Subscription</p>

              <div className="flex items-center justify-center mt-2 mx-4">
                <div className="h-60 w-60 rounded-full bg-emerald-900 flex items-center justify-center shadow-emerald-950 shadow-xl">
                <p className="text-5xl text-gray-200 font-bold">ETB 14</p>
                </div>
              </div>

              </div>

                <button
                  disabled={loadingPlan !== null}
                  className="mt-6 text-2xl text-zinc-200 inline-flex items-center justify-center rounded-2xl bg-emerald-900 shadow-emerald-950 shadow-lg px-4 py-2.5 transition hover:bg-green-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  { 
                    loadingPlan ? "Redirecting…" : 'Subscribe'
                  }
                </button>
            </div>


             <div className="rounded-2xl bg-amber-600 p-6 ring-1 ring-gold-200 flex flex-col h-120 shadow-amber-800 shadow-2xl">
              <div className="flex-1 justify-center text-center">
                <h2 className="text-2xl font-semibold">Yearly pack</h2>
                <p className="mt-2 text-gray-300 text-md ">Enjoy discounted yearly subscription</p>

              <div className="flex items-center justify-center mt-2 mx-4">
                <div className="h-60 w-60 rounded-full bg-amber-700 flex items-center justify-center shadow-amber-800 shadow-xl">
                <p className="text-5xl text-white font-bold">ETB 140</p>
                </div>
              </div>

              </div>

                <button
                  disabled={loadingPlan !== null}
                  className="mt-6 text-2xl font-semibold text-zinc-200 inline-flex items-center justify-center rounded-2xl bg-amber-700 px-4 py-2.5 shadow-amber-800 shadow-md transition hover:bg-green-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  { 
                  loadingPlan ? "Redirecting…" : 'Subscribe'
                  }
                </button>
            </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-200">Thanks for choosing us.</p>
      </div>
    </div>
  );
}




