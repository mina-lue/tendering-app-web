import React from "react";
import Image from "next/image";
import { TelebirrPayment } from "./TelebirrPayment";

const PaymentPage = () => {
  const callbackUrl_ = `${process.env.NEXT_PUBLIC_BASE_URL}/api/telebirr/callback`;
  return (
    <div>
      <Image
        src="/telebirr-logo.png"
        alt="telebirr-logo"
        width={100}
        height={100}
      />
      <TelebirrPayment
        orderId={"1"}
        amount={200}
        description={"for subscription"}
        callbackUrl={callbackUrl_}
      />
    </div>
  );
};

export default PaymentPage;
