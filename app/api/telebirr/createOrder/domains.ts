// Define the types needed for the API.
// NOTE: These are defined locally for a self-contained example.
export interface TelebirrConfig {
  baseUrl: string;
  webBaseUrl: string;
  fabricAppId: string;
  appSecret: string;
  merchantAppId: string;
  merchantCode: string;
  privateKey: string;
}

export interface CreateOrderRequestBody {
  title: string;
  amount: string;
}

export interface FabricTokenResponse {
  code: number;
  message: string;
  token: string;
  expires_in: number;
}

export interface CreateOrderResponse {
  code: number;
  message: string;
  biz_content: {
    prepay_id: string;
  };
}