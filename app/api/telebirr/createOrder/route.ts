import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderRequestBody, CreateOrderResponse, FabricTokenResponse, TelebirrConfig } from './domains';
import { applyFabricToken } from './applyFabricToken';
import { createRawRequest, requestCreateOrder } from './createOrderService';


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

