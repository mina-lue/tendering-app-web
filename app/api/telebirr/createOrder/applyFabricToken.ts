import { Agent } from "https";
import { FabricTokenResponse, TelebirrConfig } from "./domains";

const agent = new Agent({
  rejectUnauthorized: false,
});


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