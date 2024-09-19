import { CHAIN_URLS } from "../constants/blockchain.constants.js";
import { ChainType } from "../blockchain/blockchain.interfaces.js";

export const getBaseUrl = (chain: string): string => {
  const chainType = validateChainType(chain);
  return (
    CHAIN_URLS[chainType] || "Chain does not exist in the Cronos Ecosystem"
  );
};

const validateChainType = (name: string): ChainType => {
  if (Object.values(ChainType).includes(name as ChainType)) {
    return name as ChainType;
  }
  throw new Error(
    `Invalid chain name: ${name}. Must be one of ${Object.values(
      ChainType
    ).join(", ")}`
  );
};
