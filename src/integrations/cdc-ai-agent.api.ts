import { QueryOptions } from '@/lib/client';
import { ClientError } from '../lib/interfaces/error.interfaces';
import { CdcAiAgentResponse, Method } from './cdc-ai-agent.interfaces';

export type Query = {
  /**
   * Sends a query to the CDC Agent AI Service and fetches the AI-generated response.
   *
   * @param {string} query - The query string to be sent to the CDC Agent AI Service (e.g., questions or commands related to blockchain).
   * @returns {Promise<{ message: string; object: any }>} A promise that resolves to an object containing the AI-generated message and related data.
   *
   * @example
   * const client = createClient({ openAI: { apiKey: 'YOUR_OPEN_AI_API_KEY' }, chain: { rpc: 'CHAIN_RPC' }, explorer: { apiKey: 'EXPLORER_API_KEY' }, wallet: { mnemonic: 'YOUR_WALLET_MNEMONIC' } });
   * async function sendQuery() {
   *   try {
   *     const response = await client.agent.generateQuery('What is the latest block?');
   *     console.log('CDC Agent AI Response:', response.message);
   *   } catch (e) {
   *     console.error('Error fetching CDC Agent AI response:', e);
   *   }
   * }
   * sendQuery();
   */
  generateQuery: (query: string) => Promise<CdcAiAgentResponse>;
};

/**
 * Generates a response by sending a query and options to the CDC AI Agent service using the native fetch API.
 *
 * @param {string} query - The query string to send.
 * @param {QueryOptions} options - The options object containing API keys, chain info, etc.
 * @returns {Promise<CdcAiAgentResponse>} - The response from the CDC AI Agent service.
 */
export const generateQuery = async (query: string, options: QueryOptions): Promise<CdcAiAgentResponse> => {
  const url = 'https://ai-agent-api.crypto.com/api/v1/cdc-ai-agent-service/query';
  const payload = { query, options };

  const response = await fetch(url, {
    method: Method.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data: CdcAiAgentResponse = await response.json();
  if (!response.ok) {
    throw new ClientError(`Generate query failed with status ${response.status}:`, data);
  }

  return data;
};
