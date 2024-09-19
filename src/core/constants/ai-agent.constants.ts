import OpenAI from "openai";
import { BlockchainFunction } from "../blockchain/blockchain.interfaces.js";
import {
  sendTransactionParameters,
  listWalletsParameters,
  getBalanceParameters,
  getLatestBlockParameters,
  getTransactionsByAddressParameters,
  getContractAbiParameters,
  getTransactionByHash,
  getBlockByNumberParameters,
  getTransactionStatusParameters,
  createWalletParameters,
} from "../helpers/ai-agent.helpers.js";

export const RESULT_PLACEHOLDER = {
  action: "",
  message: "",
  data: {},
};

export const CONTENT: string =
  "You are an AI assistant that helps users interact with Ethereum and Cronos blockchains. You can use multiple functions if needed to fulfill the user's request.";

export const TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: BlockchainFunction.SendTransaction,
      description: "Send an Ethereum transaction from the current wallet",
      parameters: sendTransactionParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.ListWallets,
      description: "List all created wallets using MYMNEMONICS",
      parameters: listWalletsParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.GetBalance,
      description: "Get the current balance of specified Ethereum addresses",
      parameters: getBalanceParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.GetLatestBlock,
      description: "Get the latest block height from the Cronos blockchain",
      parameters: getLatestBlockParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.GetTransactionsByAddress,
      description:
        "Get the list of transactions for a specified Cronos address",
      parameters: getTransactionsByAddressParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.GetContractABI,
      description: "Get the ABI of a verified smart contract",
      parameters: getContractAbiParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.GetTransactionByHash,
      description: "Get the details of a transaction by its hash",
      parameters: getTransactionByHash,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.GetBlocksByNumber,
      description: "Get information about blocks by its numbers",
      parameters: getBlockByNumberParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.GetTransactionStatus,
      description: "Get the status of a transaction by its hash",
      parameters: getTransactionStatusParameters,
    },
  },
  {
    type: "function",
    function: {
      name: BlockchainFunction.CreateWallet,
      description: "Create a new random wallet",
      parameters: createWalletParameters,
    },
  },
];
