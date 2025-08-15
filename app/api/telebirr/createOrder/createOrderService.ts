
import crypto from 'crypto'; // Import the crypto module for signing
import { Agent } from 'https'; // Import the Agent class
import { CreateOrderResponse, TelebirrConfig } from './domains';


// certificate-based approach for your production environment.
const agent = new Agent({
  rejectUnauthorized: false,
});

// Fields not participating in signature, as per the official code
const excludeFields = [
  "sign",
  "sign_type",
  "header",
  "refund_info",
  "openType",
  "raw_request",
  // The official code also excludes `biz_content` itself, as its fields are
  // flattened and included separately.
  "biz_content",
];

// --- Utility functions from the official code, adapted for this file ---
function createTimeStamp(): string {
  return Math.round(new Date().getTime() / 1000).toString();
}

function createNonceStr(): string {
  const chars = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z",
  ];
  let str = "";
  for (let i = 0; i < 32; i++) {
    const index = Math.floor(Math.random() * chars.length);
    str += chars[index];
  }
  return str;
}

function createMerchantOrderId(): string {
  return new Date().getTime().toString();
}

/**
 * The core signing function, now directly mirroring the logic from the official
 * `signRequestObject` function but using the built-in `crypto` module.
 * It flattens the `biz_content` fields for the signature string.
 */
function signRequestObject(requestObject: any, privateKey: string): string {
  try {
    const fields = [];
    const fieldMap: any = {};
    
    // Collect top-level fields (excluding excluded fields)
    for (const key in requestObject) {
      if (excludeFields.includes(key)) {
        continue;
      }
      fields.push(key);
      fieldMap[key] = requestObject[key];
    }
    
    // Collect nested fields from biz_content
    if (requestObject.biz_content) {
      const biz = requestObject.biz_content;
      for (const key in biz) {
        if (excludeFields.includes(key)) {
          continue;
        }
        fields.push(key);
        fieldMap[key] = biz[key];
      }
    }
    
    // Sort all collected fields alphabetically
    fields.sort();

    // Create the signature string
    const signStrList = [];
    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      signStrList.push(`${key}=${fieldMap[key]}`);
    }
    const signOriginStr = signStrList.join("&");
    console.log("Signature String:", signOriginStr);

    // Sign the content using the correct RSA-PSS padding scheme
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signOriginStr);
    return signer.sign(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
      }, 
      'base64'
    );
  } catch (error) {
    console.error('Error signing request object. This is likely due to an incorrect private key format.');
    console.error('Please ensure your private key is a valid, unencrypted PEM string.');
    throw error;
  }
}

// --- Main API functions ---



export async function requestCreateOrder(fabricToken: string, title: string, amount: string, config: TelebirrConfig): Promise<CreateOrderResponse> {
  const reqObject = createRequestObject(title, amount, config);
  const options = {
    method: 'POST',
    body: JSON.stringify(reqObject),
    headers: {
      'Content-Type': 'application/json',
      'X-APP-Key': config.fabricAppId,
      'Authorization': fabricToken,
    },
    agent, 
  };

  const response = await fetch(`${config.baseUrl}/payment/v1/merchant/preOrder`, options);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create order: ${response.status} - ${errorBody}`);
  }
  return await response.json();
}

/**
 * Creates the request object for the pre-order API.
 */
function createRequestObject(title: string, amount: string, config: TelebirrConfig) {
  const biz = {
    notify_url: 'https://www.google.com',
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: 'Checkout',
    title: title,
    total_amount: amount,
    trans_currency: 'ETB',
    timeout_express: '120m',
    business_type: 'BuyGoods',
    payee_identifier: config.merchantCode,
    payee_identifier_type: '04',
    payee_type: '5000',
    redirect_url: 'https://www.bing.com/',
    callback_info: 'From web',
  };

  const req = {
    timestamp: createTimeStamp(),
    nonce_str: createNonceStr(),
    method: 'payment.preorder',
    version: '1.0',
    sign_type: 'SHA256WithRSA',
    biz_content: biz, 
    sign: ''
  };

  // The entire request object is passed to the signing function.
  req.sign = signRequestObject(req, config.privateKey);
  
  return req;
}

/**
 * Creates the final raw request URL with all required parameters.
 * FIX: This function now correctly takes title and amount as arguments and includes them in the URL.
 */
export function createRawRequest(prepayId: string, title: string, amount: string, config: TelebirrConfig): string {
  // Create a map with all parameters required for the final URL
  const map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: createNonceStr(),
    prepay_id: prepayId,
    timestamp: createTimeStamp(),
    version: '1.0',
    trade_type: 'Checkout',
    business_type: 'BuyGoods',
    payee_identifier: config.merchantCode,
    payee_identifier_type: '04',
    payee_type: '5000',
    total_amount: amount,
    trans_currency: 'ETB',
    title: title,
    timeout_express: '120m',
    redirect_url: 'https://www.bing.com/',
  };

  const sign = signRequestObject(map, config.privateKey);
  
  // The array now includes all signed and URL-encoded parameters.
  const rawRequest = [
    `appid=${encodeURIComponent(map.appid)}`,
    `merch_code=${encodeURIComponent(map.merch_code)}`,
    `nonce_str=${encodeURIComponent(map.nonce_str)}`,
    `prepay_id=${encodeURIComponent(map.prepay_id)}`,
    `timestamp=${encodeURIComponent(map.timestamp)}`,
    `sign=${encodeURIComponent(sign)}`,
    `sign_type=SHA256WithRSA`,
    `version=${encodeURIComponent(map.version)}`,
    `trade_type=${encodeURIComponent(map.trade_type)}`,
    `business_type=${encodeURIComponent(map.business_type)}`,
    `payee_identifier=${encodeURIComponent(map.payee_identifier)}`,
    `payee_identifier_type=${encodeURIComponent(map.payee_identifier_type)}`,
    `payee_type=${encodeURIComponent(map.payee_type)}`,
    `total_amount=${encodeURIComponent(map.total_amount)}`,
    `trans_currency=${encodeURIComponent(map.trans_currency)}`,
    `title=${encodeURIComponent(map.title)}`,
    `timeout_express=${encodeURIComponent(map.timeout_express)}`,
    `redirect_url=${encodeURIComponent(map.redirect_url)}`,
  ].join('&');
  return rawRequest;
}


