export interface ExplorerResponse<T> {
  status: string;
  message: string;
  result: T;
  pagination?: Pagination;
}

export interface ExplorerRequest {
  address?: string;
  session?: string;
  limit?: number;
  txHash?: string;
  txDetail?: boolean;
  tag?: string;
  apikey: string;
  chain: string;
}

export interface TransactionAddress {
  address: string;
  isContract: boolean;
}

export interface Transaction {
  blockNumber: number;
  transactionHash: string;
  status: number;
  error?: string;
  from: TransactionAddress;
  to: TransactionAddress;
  gas: string;
  gasPrice: string;
  gasLimit: string;
  timestamp: number;
  methodId?: string;
  methodName?: string;
  index: number;
  value: string;
  type: string;
  nonce: number;
  input: string;
  contractAddress?: string;
  confirmations: number;
  transactionIndex: string;
}

export interface Block {
  miner: string;
  baseFeePerGas: string;
  logsBloom: string;
  hash: string;
  parentHash: string;
  stateRoot: string;
  l1BatchNumber: string;
  timestamp: string;
  difficulty: string;
  size: string;
  mixHash: string;
  transactionsRoot: string;
  receiptsRoot: string;
  gasUsed: string;
  sealFields: string[];
  sha3Uncles: string;
  number: string;
  gasLimit: string;
  extraData: string;
  l1BatchTimestamp: string;
  totalDifficulty: string;
  uncles: string[];
  transactions: string[];
  nonce: string;
}

export interface Status {
  status: number;
  isError: boolean;
  errDescription: string;
}

export interface Pagination {
  totalRecord: number;
  totalPage: number;
  currentPage: number;
  limit: number;
  session: string;
}
