import { ChainType, GlobalContext } from './blockchain.interfaces.js';

export const GLOBAL_CONTEXT: GlobalContext = {
  walletMaxAccount: 0,
  currentWalletIndex: 0,
};

export const CHAIN_URLS: Record<ChainType, string> = {
  [ChainType.EVM]: 'https://explorer-api.cronos.org',
  [ChainType.ZKEVM]: 'https://explorer-api.zkevm.cronos.org',
  [ChainType.ZKEVM_TESTNET]: 'https://explorer-api.testnet.zkevm.cronos.org',
};
