import { HDNodeWallet } from 'ethers';
import { Transaction, Pagination, TransactionAddress, Block } from '../explorer/explorer.interfaces';

export type GlobalContext = {
  walletMaxAccount: number;
  currentWalletIndex: number;
};

export interface BlockchainFunctionResponse<T> {
  status: Status;
  message: string;
  action: string;
  data?: T;
}

export enum BlockchainFunction {
  SendTransaction = 'sendTransaction',
  ListWallets = 'listWallets',
  GetBalance = 'getBalance',
  GetLatestBlock = 'getLatestBlock',
  GetTransactionsByAddress = 'getTransactionsByAddress',
  GetContractABI = 'getContractABI',
  GetTransactionByHash = 'getTransactionByHash',
  GetBlocksByNumber = 'getBlocksByNumber',
  GetTransactionStatus = 'getTransactionStatus',
  CreateWallet = 'createWallet',
}

export type BlockchainFunctionType =
  | SendTransactionData
  | ListWalletsData
  | GetBalanceData
  | GetLatestBlockData
  | GetTransactionsByAddressData
  | GetContractAbiData
  | GetTransactionStatusData
  | GetTransactionByHashData
  | GetBlockByNumberData
  | CreateWalletData;

export interface SendTransactionData {
  walletIndex: number;
  fromAddress: string;
  blockNumber: number;
  transactionHash: string;
}

export interface ListWalletsData {
  wallets: Wallet[];
  currentWallet: {
    index: number;
    address: string;
  };
}

export interface GetBalanceData {
  balances: Balance[];
}

export interface GetLatestBlockData {
  blockHeight: number;
  timestamp: string;
}

export interface GetContractAbiData {
  abi: string;
}

export interface GetTransactionsByAddressData {
  transactions: Transaction[];
  pagination?: Pagination;
}

export interface CreateWalletData {
  newWallet: {
    index: number;
    address: HDNodeWallet;
  };
}

export interface GetBlockByNumberData {
  blocks: Block[];
}

export interface GetTransactionByHashData {
  blockNumber: number;
  from: TransactionAddress;
  to: TransactionAddress;
  value: string;
  gasPrice: string;
  nonce: number;
  transactionIndex: number;
  gas: number;
}
export interface GetTransactionStatusData {
  statusCode: number;
  isError: boolean;
  errorDescription: string;
}

interface Wallet {
  walletNumber: number;
  address: string;
}

interface Balance {
  address: string;
  balanceWei?: string;
  balanceEth?: string;
  error?: string;
}

export enum ChainType {
  EVM = 'cronos-evm',
  ZKEVM = 'cronos-zkevm',
  ZKEVM_TESTNET = 'cronos-zkevm-testnet',
}

export enum Status {
  Success = 'Success',
  Failed = 'Failed',
}

export enum Unit {
  Ether = 'ether',
  Gwei = 'gwei',
}
