import { CdcAiAgentResponse, Method } from './cdc-ai-agent.interfaces';

/**
 * Generates a response by sending a query and options to the CDC AI Agent service using the native fetch API.
 *
 * @param {string} query - The query string to send.
 * @param {object} options - The options object containing API keys, chain info, etc.
 * @returns {Promise<CdcAiAgentResponse>} - The response from the CDC AI Agent service.
 */
export const generateQuery = async (query: string, options: object): Promise<CdcAiAgentResponse> => {
  const url = 'http://localhost:8000/api/v1/cdc-ai-agent-service/query';
  const payload = { query, options };

  try {
    const response = await fetch(url, {
      method: Method.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CdcAiAgentResponse = await response.json();
    return data;
  } catch (e) {
    const error = e as Error;
    console.error(`[cdcAiAgent/generateResponse] - ${error.message}`);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};
