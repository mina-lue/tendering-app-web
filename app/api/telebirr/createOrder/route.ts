import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto'; // Import the crypto module for signing
import { Agent } from 'https'; // Import the Agent class


// The main Next.js API route handler function.
export async function POST(req: NextRequest) {
  // Extract the JSON body from the NextRequest object
  const { title, amount } = (await req.json()) as CreateOrderRequestBody;

  // Configuration from environment variables
  const privateKeyString = process.env.TELEBIRR_PRIVATE_KEY || 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/ZcoOng1sJZ4CegopQVCw3HYqqVRLEudgT+dDpS8fRVy7zBgqZunju2VRCQuHeWs7yWgc9QGd4/8kRSLY+jlvKNeZ60yWcqEY+eKyQMmcjOz2Sn41fcVNgF+HV3DGiV4b23B6BCMjnpEFIb9d99/TsjsFSc7gCPgfl2yWDxE/Y1B2tVE6op2qd63YsMVFQGdre/CQYvFJENpQaBLMq4hHyBDgluUXlF0uA1X7UM0ZjbFC6ZIB/Hn1+pl5Ua8dKYrkVaecolmJT/s7c/+/1JeN+ja8luBoONsoODt2mTeVJHLF9Y3oh5rI+IY8HukIZJ1U6O7/JcjH3aRJTZagXUS9AgMBAAECggEBALBIBx8JcWFfEDZFwuAWeUQ7+VX3mVx/770kOuNx24HYt718D/HV0avfKETHqOfA7AQnz42EF1Yd7Rux1ZO0e3unSVRJhMO4linT1XjJ9ScMISAColWQHk3wY4va/FLPqG7N4L1w3BBtdjIc0A2zRGLNcFDBlxl/CVDHfcqD3CXdLukm/friX6TvnrbTyfAFicYgu0+UtDvfxTL3pRL3u3WTkDvnFK5YXhoazLctNOFrNiiIpCW6dJ7WRYRXuXhz7C0rENHyBtJ0zura1WD5oDbRZ8ON4v1KV4QofWiTFXJpbDgZdEeJJmFmt5HIi+Ny3P5n31WwZpRMHGeHrV23//0CgYEA+2/gYjYWOW3JgMDLX7r8fGPTo1ljkOUHuH98H/a/lE3wnnKKx+2ngRNZX4RfvNG4LLeWTz9plxR2RAqqOTbX8fj/NA/sS4mru9zvzMY1925FcX3WsWKBgKlLryl0vPScq4ejMLSCmypGz4VgLMYZqT4NYIkU2Lo1G1MiDoLy0CcCgYEAwt77exynUhM7AlyjhAA2wSINXLKsdFFF1u976x9kVhOfmbAutfMJPEQWb2WXaOJQMvMpgg2rU5aVsyEcuHsRH/2zatrxrGqLqgxaiqPz4ELINIh1iYK/hdRpr1vATHoebOv1wt8/9qxITNKtQTgQbqYci3KV1lPsOrBAB5S57nsCgYAvw+cagS/jpQmcngOEoh8I+mXgKEET64517DIGWHe4kr3dO+FFbc5eZPCbhqgxVJ3qUM4LK/7BJq/46RXBXLvVSfohR80Z5INtYuFjQ1xJLveeQcuhUxdK+95W3kdBBi8lHtVPkVsmYvekwK+ukcuaLSGZbzE4otcn47kajKHYDQKBgDbQyIbJ+ZsRw8CXVHu2H7DWJlIUBIS3s+CQ/xeVfgDkhjmSIKGX2to0AOeW+S9MseiTE/L8a1wY+MUppE2UeK26DLUbH24zjlPoI7PqCJjl0DFOzVlACSXZKV1lfsNEeriC61/EstZtgezyOkAlSCIH4fGr6tAeTU349Bnt0RtvAoGBAObgxjeH6JGpdLz1BbMj8xUHuYQkbxNeIPhH29CySn0vfhwg9VxAtIoOhvZeCfnsCRTj9OZjepCeUqDiDSoFznglrKhfeKUndHjvg+9kiae92iI6qJudPCHMNwP8wMSphkxUqnXFR3lr9A765GA980818UWZdrhrjLK1IIZdh+X1'; // Fallback to provided key
  const config: TelebirrConfig = {
    baseUrl: process.env.TELEBIRR_BASE_URL || 'https://196.188.120.3:38443/apiaccess/payment/gateway',
    webBaseUrl: process.env.TELEBIRR_WEB_BASE_URL || 'https://developerportal.ethiotelebirr.et:38443/payment/web/paygate?',
    fabricAppId: process.env.TELEBIRR_FABRIC_APP_ID || 'c4182ef8-9249-458a-985e-06d191f4d505',
    appSecret: process.env.TELEBIRR_APP_SECRET || 'fad0f06383c6297f545876694b974599',
    merchantAppId: process.env.TELEBIRR_MERCHANT_APP_ID || '1469440255846403',
    merchantCode: process.env.TELEBIRR_MERCHANT_CODE || '357871',
    // The private key now includes the PEM header and footer.
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
${privateKeyString}
-----END RSA PRIVATE KEY-----`,
  };

  try {
    // 1. Get the fabric token
    const applyFabricTokenResult: FabricTokenResponse = await applyFabricToken(config);
    console.log(applyFabricTokenResult);
    const fabricToken = applyFabricTokenResult.token;

    // 2. Create the order
    // FIX: Use the 'title' and 'amount' from the request body.
    const createOrderResult: CreateOrderResponse = await requestCreateOrder(fabricToken, title, amount, config);
    const prepayId = createOrderResult.biz_content.prepay_id;
    
    // 3. Assemble the final payment URL
    // FIX: Pass the 'title' and 'amount' to createRawRequest
    const rawRequest = createRawRequest(prepayId, title, amount, config);
    // CORRECTED: The rawRequest now contains all necessary parameters, including version and trade_type.
    // We simply append it to the base URL.
    const assembledUrl = `${config.webBaseUrl}${rawRequest}`;

    // Send the URL back to the client
    return new NextResponse(assembledUrl, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


// Define the types needed for the API.
// NOTE: These are defined locally for a self-contained example.
interface TelebirrConfig {
  baseUrl: string;
  webBaseUrl: string;
  fabricAppId: string;
  appSecret: string;
  merchantAppId: string;
  merchantCode: string;
  privateKey: string;
}

interface CreateOrderRequestBody {
  title: string;
  amount: string;
}

interface FabricTokenResponse {
  code: number;
  message: string;
  token: string;
  expires_in: number;
}

interface CreateOrderResponse {
  code: number;
  message: string;
  biz_content: {
    prepay_id: string;
  };
}

// Create a reusable agent instance to bypass SSL validation in development.
// WARNING: This is NOT safe for production.
// You should only use this for development/testing, and switch to a proper
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

export async function applyFabricToken(config: TelebirrConfig): Promise<FabricTokenResponse> {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      appId: config.fabricAppId,
      appSecret: config.appSecret
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-APP-Key': config.fabricAppId
    },
    agent, 
  };
  
  try {
    const response = await fetch(`${config.baseUrl}/payment/v1/token`, options);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to get fabric token: ${response.status} - ${errorBody}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error in applyFabricToken:', error);
    throw error;
  }
}

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
function createRawRequest(prepayId: string, title: string, amount: string, config: TelebirrConfig): string {
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


