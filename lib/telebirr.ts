import crypto from "crypto";

type InitParams = {
  outTradeNo: string;       
  totalAmount: number;      
  subject: string;          
  returnUrl: string;        
  notifyUrl: string;        
};

const APP_KEY = process.env.TELEBIRR_APP_KEY!;
const APP_SECRET = process.env.TELEBIRR_APP_SECRET!;
const SHORT_CODE = process.env.TELEBIRR_SHORT_CODE!;

/**
 * IMPORTANT:
 * Replace computeSignature with Telebirr's actual signing algorithm.
 * Many integrations sort fields alphabetically and sign with appSecret (MD5/HMAC).
 * Keep fields exactly as Telebirr expects.
 */
function computeSignature(params: Record<string, any>) {
  // Example (placeholder). Confirm with Telebirr docs:
  const sorted = Object.keys(params).sort();
  const base = sorted.map(k => `${k}=${params[k]}`).join("&") + APP_SECRET;
  return crypto.createHash("md5").update(base, "utf8").digest("hex");
}

export function buildCreateOrderPayload(p: InitParams) {
  const payload: Record<string, any> = {
    appKey: APP_KEY,
    shortCode: SHORT_CODE,
    outTradeNo: p.outTradeNo,
    subject: p.subject,
    totalAmount: p.totalAmount,       // Telebirr expects number (confirm decimals/no decimals)
    returnUrl: p.returnUrl,
    notifyUrl: p.notifyUrl,
    timeoutExpress: "30m",            // example timeout
    // add any other Telebirr-required fields here...
  };

  payload.sign = computeSignature(payload);
  return payload;
}
