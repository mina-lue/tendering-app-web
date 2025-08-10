"use client";
import { useState } from "react";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/telebirr/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "SUBSCRIPTION" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to initiate payment");
      window.location.href = data.paymentUrl;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
    >
      {loading ? "Redirecting..." : "Subscribe (20 ETB/month)"}
    </button>
  );
}
