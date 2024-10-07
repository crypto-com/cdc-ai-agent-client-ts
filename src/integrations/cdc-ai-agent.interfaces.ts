export interface CdcAiAgentResponse {
  status: string;
  message?: string;
  hasErrors?: boolean;
  result?: Result;
}

export type Result = {
  status: Status;
  function: string;
  message: string;
  data: object;
};

export enum Status {
  Success = 'Success',
  Failed = 'Failed',
}

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
};

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * Client params for creating a CDC AI Agent client instance.
 *
 * @interface
 * @property {object} openAI - The API key for OpenAI and the model to use. Defaults to gpt-4-turbo if not provided.
 * @property {number} chainId - The chain number:
 * - 25: cronos
 * - 338: cronos-testnet
 * - 388: cronos-zkevm
 * - 282: cronos-zkevm-testnet
 * @property {object} explorerKeys - The API keys for the respective chain number. Server will select the api key according to the chainId.
 * @property {string} signerAppUrl - Optional signer app URL. Refer to: https://github.com/crypto-com/cdc-ai-agent-signer-app
 * @property {string} customRPC - Optional custom RPC URL to override the server's default RPC URL specific to the chainId.
 * @property {QueryContext[]} context - Optional context for the query. Context can be obtained from the server response.
 * @example
 *   const queryOptions: QueryOptions = {
    openAI: {
      apiKey: OPEN_AI_API_KEY,
      model: 'gpt-4o',
    },
    chainId: CHAIN_ID,
    explorerKeys: {
      cronosMainnetKey: CRONOS_MAINNET_API_KEY,
      cronosTestnetKey: CRONOS_TESTNET_API_KEY,
      cronosZkEvmKey: CRONOS_ZKEVM_API_KEY,
      cronosZkEvmTestnetKey: CRONOS_ZKEVM_TESTNET_API_KEY,
    },
    signerAppUrl: 'https://my-signer-app',
    context: [],
    customRPC: 'https://rpc.vvs.finance, 
  };

 */
export interface QueryOptions {
  openAI: {
    apiKey: string;
    model?: string;
  };
  chainId: number;
  explorerKeys: {
    cronosMainnetKey?: string;
    cronosTestnetKey?: string;
    cronosZkEvmKey?: string;
    cronosZkEvmTestnetKey?: string;
  };
  signerAppUrl?: string;
  context?: QueryContext[];
  customRPC?: string;
}

export interface QueryContext {
  role: Role;
  content: string;
}

export enum Role {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}
