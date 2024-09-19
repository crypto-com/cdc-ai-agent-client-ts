export interface OpenAIOptions {
  apiKey: string;
}

export interface ChainOptions {
  id: number;
  name: string;
  rpc: string;
}

export interface ExplorerOptions {
  apiKey: string;
}
export interface WalletOptions {
  mnemonic: string;
}

export interface Options {
  openAI: OpenAIOptions;
  chain: ChainOptions;
  explorer: ExplorerOptions;
  wallet: WalletOptions;
}

export interface Tool<T> {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: T;
  };
}
export interface SendTransactionParams {
  to_address: string;
  amount: number;
}

export interface GetBalanceParams {
  walletAddresses: string[];
}

export interface GetTransactionsByAddressParams {
  address: string;
  session?: string;
  limit?: number;
}

export interface GetContractAbiParams {
  address: string;
}

export enum Role {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export interface FunctionArgs {
  walletAddresses: string[];
  address: string;
  session: string;
  limit: number;
  txHash: string;
  blockNumbers: string[];
  txDetail: boolean;
  toAddress: string;
  amount: number;
}

export interface CommandContext {
  role: Role;
  content: string;
}

export interface AIMessageResponse {
  content: string;
  tool_calls?: {
    function: {
      name: string;
      arguments: string;
    };
  }[];
}

export interface CommandResult {
  action: string;
  message: string;
  data: object;
}
