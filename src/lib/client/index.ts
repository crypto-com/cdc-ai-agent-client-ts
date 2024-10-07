import { CdcAiAgentClient, generateQuery } from '../../integrations/cdc-ai-agent.api';
import { CdcAiAgentResponse, QueryOptions } from '../../integrations/cdc-ai-agent.interfaces';

/**
 * Creates a new client for interacting with the CDC Agent AI Service using OpenAI, blockchain, and explorer configurations.
 *
 * @param {QueryOptions} queryOptions - The configuration for setting up the CDC Agent AI Service client, including OpenAI API key, blockchain details, explorer API key, and wallet mnemonic.
 * @returns {CdcAiAgentClient} Returns an object with methods to interact with the CDC Agent AI Service.
 *
 * @example
 * const client = createClient(queryOptions);
 *
 * async function sendQuery() {
 *   try {
 *     const response = await client.agent.generateQuery('What is the latest block?');
 *     console.log('AI Response:', JSON.stringify(response, null, 2));
 *   } catch (e) {
 *     console.error('Error sending query:', e);
 *   }
 * }
 * sendQuery();
 */
export const createClient = (queryOptions: QueryOptions): CdcAiAgentClient => {
  return {
    agent: {
      /**
       * Sends a query to the CDC Agent AI Service and fetches the AI-generated response.
       *
       * @param {string} query - The query string to be sent to the CDC Agent AI Service.
       * @returns {Promise<{ message: string; object: object }>} A promise that resolves to the AI-generated message and data.
       */
      generateQuery: (query: string): Promise<CdcAiAgentResponse> => generateQuery(query, queryOptions),
    },
  };
};
