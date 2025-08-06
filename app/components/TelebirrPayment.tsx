// components/TelebirrPayment.tsx
'use client';
import { useEffect, useState } from 'react';

interface TelebirrPaymentProps {
  orderId: string;
  amount: number;
  description: string;
  callbackUrl: string;      // where Telebirr should POST status
}

export function TelebirrPayment({
  orderId,
  amount,
  description,
  callbackUrl,
}: TelebirrPaymentProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/telebirr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount, description, callbackUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error');
        setQrUrl(data.qrUrl);
        setPaymentUrl(data.paymentUrl);
      } catch (e: any) {
        setError(e.message);
      }
    }
    init();
  }, [orderId, amount, description, callbackUrl]);

  if (error) {
    return <p className="text-red-600">Payment error: {error}</p>;
  }
  if (!qrUrl && !paymentUrl) {
    return <p>Loading payment info…</p>;
  }

  return (
    <div className="space-y-4">
      {qrUrl && (
        <div>
          <img
            src={qrUrl}
            alt="Scan this Telebirr QR to pay"
            className="mx-auto w-48 h-48"
          />
          <p className="text-center text-sm text-gray-600">
            Scan with your Telebirr app
          </p>
        </div>
      )}
      {paymentUrl && (
        <div className="text-center">
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Pay via Telebirr
          </a>
        </div>
      )}
    </div>
  );
}
