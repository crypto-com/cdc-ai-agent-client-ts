import { ethers } from "ethers";
import { generateResponse } from "../../services/index.js";
import { Output } from "../interfaces/httpEnums.js";

export interface ChainAIClient {
  agent: Query;
}

export type Query = {
  /**
   * Sends a query to the Chain AI and fetches the AI-generated response.
   *
   * @param {string} query - The query string to be sent to the Chain AI (e.g., questions or commands related to blockchain).
   * @returns {Promise<{ message: string; object: any }>} A promise that resolves to an object containing the AI-generated message and related data.
   *
   * @example
   * const client = createClient({ openAI: { apiKey: 'YOUR_OPEN_AI_API_KEY' }, chain: { rpc: 'CHAIN_RPC' }, explorer: { apiKey: 'EXPLORER_API_KEY' }, wallet: { mnemonic: 'YOUR_WALLET_MNEMONIC' } });
   * async function sendQuery() {
   *   try {
   *     const response = await client.assistant.generateResponse('What is the latest block?');
   *     console.log('AI Response:', response.message);
   *   } catch (e) {
   *     console.error('Error fetching AI response:', e);
   *   }
   * }
   * sendQuery();
   */
  generateResponse: (query: string) => Promise<{
    message: string;
    object: any;
  }>;
};

/**
 * Configuration parameters for creating a Chain AI client instance.
 *
 * @interface
 * @property {object} openAI - Configuration for OpenAI API access, including the API key.
 * @property {object} chain - Configuration for blockchain specifics such as chain ID, name, and RPC URL.
 * @property {object} explorer - Configuration for blockchain explorer API access, including the base URL and API key.
 * @property {object} wallet - Configuration for wallet settings, specifically the mnemonic.
 */
export interface ClientConfig {
  /** Configuration for OpenAI API access */
  openAI: {
    apiKey: string;
  };

  /** Configuration for blockchain specifics */
  chain: {
    id: number;
    name: string;
    rpc: string;
  };

  /** Configuration for blockchain explorer API access */
  explorer: {
    url: string;
    apiKey: string;
  };

  /** Configuration for wallet access */
  wallet: {
    mnemonic: string;
  };
}

/**
 * Creates a new client for interacting with the Chain AI service using OpenAI, blockchain, and explorer configurations.
 *
 * @param {ClientConfig} config - The configuration for setting up the Chain AI client, including OpenAI API key, blockchain details, explorer API key, and wallet mnemonic.
 * @returns {ChainAIClient} Returns an object with methods to interact with the Chain AI API.
 *
 * @example
 * const client = createClient({
 *   openAI: {
 *     apiKey: 'YOUR_OPEN_AI_API_KEY',
 *   },
 *   chain: {
 *     id: 282, // Chain ID for Cronos ZkEVM Testnet
 *     name: 'CHAIN_NAME',
 *     rpc: 'CHAIN_RPC_URL',
 *   },
 *   explorer: {
 *     url: 'EXPLORER_API_URL',
 *     apiKey: 'EXPLORER_API_KEY',
 *   },
 *   wallet: {
 *     mnemonic: 'YOUR_WALLET_MNEMONIC',
 *   }
 * });
 * async function sendQuery() {
 *   try {
 *     const response = await client.assistant.generateResponse('What is the latest block?');
 *     console.log('AI Response:', response.message);
 *   } catch (e) {
 *     console.error('Error sending query:', e);
 *   }
 * }
 * sendQuery();
 */
export const createClient = ({
  openAI,
  chain,
  explorer,
  wallet,
}: ClientConfig): ChainAIClient => {
  const options: ClientConfig = { openAI, chain, explorer, wallet };
  const provider = new ethers.JsonRpcProvider(chain.rpc);

  return {
    agent: {
      /**
       * Sends a query to the Chain AI and fetches the AI-generated response.
       *
       * @param {string} query - The query string to be sent to the Chain AI.
       * @returns {Promise<{ message: string; object: object }>} A promise that resolves to the AI-generated message and data.
       *
       * @example
       * const client = createClient({ apiKey: 'YOUR_OPEN_AI_API_KEY' });
       * async function sendQuery() {
       *   try {
       *     const response = await client.assistant.generateResponse('What is the latest block?');
       *     console.log('AI Response:', response.message);
       *   } catch (e) {
       *     console.error('Error sending query:', e);
       *   }
       * }
       * sendQuery();
       */
      generateResponse: (query: string): Promise<Output> =>
        generateResponse(query, options, provider),
    },
  };
};
