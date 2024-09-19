import { ethers, Provider, TransactionRequest } from "ethers";
import { Options } from "../ai-agent.interfaces.js";
import { GLOBAL_CONTEXT } from "./blockchain.constants.js";
import {
  BlockchainFunction,
  BlockchainFunctionResponse,
  CreateWalletData,
  GetBalanceData,
  GetBlockByNumberData,
  GetContractAbiData,
  GetLatestBlockData,
  GetTransactionByHashData,
  GetTransactionsByAddressData,
  GetTransactionStatusData,
  ListWalletsData,
  SendTransactionData,
  Status,
  Unit,
} from "./blockchain.interfaces.js";
import { ExplorerApi } from "../explorer/explorer.api.js";

/**
 * BlockchainService class handles blockchain operations and interacts with the Explorer API.
 *
 * @class BlockchainService
 */
export class BlockchainService {
  private explorerApi: ExplorerApi;
  private options: Options;
  private provider: Provider;

  /**
   * @param {Options} options - Configuration options including wallet and chain details.
   * @param {Provider} provider - The provider to interact with the blockchain.
   */
  constructor(options: Options, provider: Provider) {
    this.explorerApi = new ExplorerApi(
      options.explorer.apiKey,
      options.chain.name
    );
    this.options = options;
    this.provider = provider;
  }

  /**
   * Sends a transaction from the current wallet.
   *
   * @param {Object} transaction - The transaction object containing the recipient address and amount.
   * @param {string} transaction.toAddress - The recipient's address.
   * @param {number} transaction.amount - The amount of ETH to send.
   * @returns {Promise<BlockchainFunctionResponse<SendTransactionData>>} - The transaction result.
   * @memberof BlockchainService
   */
  async sendTransaction(
    toAddress: string,
    amount: number
  ): Promise<BlockchainFunctionResponse<SendTransactionData>> {
    try {
      const mnemonic = this.options.wallet.mnemonic;
      if (!mnemonic) throw Error("No mnemonic provided.");

      const wallet = ethers.Wallet.fromPhrase(
        mnemonic,
        this.provider
      ).derivePath(`m/44'/60'/0'/0/${GLOBAL_CONTEXT.currentWalletIndex}`);
      const fromAddress = wallet.address;
      const nonce = await this.provider.getTransactionCount(fromAddress);
      const feeData = await this.provider.getFeeData();
      const value = ethers.parseEther(amount.toString());

      const tx: TransactionRequest = {
        from: fromAddress,
        to: toAddress,
        value,
        nonce,
        chainId: this.options.chain.id,
        gasPrice: feeData.gasPrice,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      };

      const gasEstimate = await this.provider.estimateGas(tx);
      tx.gasLimit = gasEstimate;

      const sentTx = await wallet.sendTransaction(tx);
      const receipt = await sentTx.wait();

      if (!receipt) throw Error("No transaction receipt found.");

      return {
        status: Status.Success,
        action: BlockchainFunction.SendTransaction,
        message: `Transaction sent from wallet ${GLOBAL_CONTEXT.currentWalletIndex} (${fromAddress}) and confirmed in block ${receipt.blockNumber}. Hash: ${receipt.hash}`,
        data: {
          walletIndex: GLOBAL_CONTEXT.currentWalletIndex,
          fromAddress,
          blockNumber: receipt.blockNumber,
          transactionHash: receipt.hash,
        },
      };
    } catch (e) {
      throw Error(`Error sending transaction: ${e}`);
    }
  }

  /**
   * Lists all wallets derived from the mnemonic.
   *
   * @returns {Promise<BlockchainFunctionResponse<ListWalletsData>>} - A list of wallets.
   * @memberof BlockchainService
   */
  async listWallets(): Promise<BlockchainFunctionResponse<ListWalletsData>> {
    try {
      const mnemonic = this.options.wallet.mnemonic;
      if (!mnemonic) throw Error("No mnemonic provided.");

      const wallets: { walletNumber: number; address: string }[] = [];

      for (let i = 0; i <= GLOBAL_CONTEXT.walletMaxAccount; i++) {
        const path = `m/44'/60'/0'/0/${i}`;
        const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, path);
        wallets.push({ walletNumber: i, address: wallet.address });
      }

      return {
        status: Status.Success,
        action: BlockchainFunction.ListWallets,
        message: `Listed ${wallets.length} wallets. Current wallet: ${
          GLOBAL_CONTEXT.currentWalletIndex
        } - ${wallets[GLOBAL_CONTEXT.currentWalletIndex].address}`,
        data: {
          wallets,
          currentWallet: {
            index: GLOBAL_CONTEXT.currentWalletIndex,
            address: wallets[GLOBAL_CONTEXT.currentWalletIndex].address,
          },
        },
      };
    } catch (e) {
      throw Error(`Error fetching wallets: ${e}`);
    }
  }

  /**
   * Retrieves the balance of multiple wallet addresses.
   *
   * @param {string[]} walletAddresses - An array of wallet addresses.
   * @returns {Promise<BlockchainFunctionResponse<GetBalanceData>>} - The balance information for each address.
   * @memberof BlockchainService
   */
  async getBalance(
    walletAddresses: string[]
  ): Promise<BlockchainFunctionResponse<GetBalanceData>> {
    try {
      const wallets = await Promise.all(
        walletAddresses.map(async (address) => {
          try {
            const balance = await this.provider.getBalance(address);
            return {
              address,
              balanceWei: balance.toString(),
              balanceEth: ethers.formatUnits(balance, "ether"),
            };
          } catch (e) {
            return { address, error: `Error getting balance: ${e}` };
          }
        })
      );

      if (!wallets) throw Error("No wallets found.");

      return {
        status: Status.Success,
        action: BlockchainFunction.GetBalance,
        message: `Balances: ${wallets
          .map((b) =>
            b.error
              ? `${b.address}: ${b.error}`
              : `${b.address}: ${b.balanceEth} ETH`
          )
          .join(", ")}`,
        data: { balances: wallets },
      };
    } catch (e) {
      throw Error(`Error fetching balances: ${e}`);
    }
  }

  /**
   * Fetches the latest block from the blockchain.
   *
   * @returns {Promise<BlockchainFunctionResponse<GetLatestBlockData>>} - The latest block information.
   * @memberof BlockchainService
   */
  async getLatestBlock(): Promise<
    BlockchainFunctionResponse<GetLatestBlockData>
  > {
    try {
      const block = await this.provider.getBlock("latest");
      if (!block) throw Error("No Block found.");

      return {
        status: Status.Success,
        action: BlockchainFunction.GetLatestBlock,
        message: `Latest block height: ${block.number}`,
        data: {
          blockHeight: block.number,
          timestamp: new Date(block.timestamp * 1000).toISOString(),
        },
      };
    } catch (e) {
      throw Error(`Error fetching the latest block: ${e}`);
    }
  }

  /**
   * Fetches transactions for a specified address using the Explorer API.
   *
   * @param {string} address - The wallet address to fetch transactions for.
   * @param {string} [session] - Optional session token for paginated results.
   * @param {number} [limit] - Optional limit for the number of transactions to fetch.
   * @returns {Promise<BlockchainFunctionResponse<GetTransactionsByAddressData>>} - The transaction data for the specified address.
   * @memberof BlockchainService
   */
  async getTransactionsByAddress(
    address: string,
    session: string = "",
    limit: number = 20
  ): Promise<BlockchainFunctionResponse<GetTransactionsByAddressData>> {
    try {
      const response = await this.explorerApi.getTransactionsByAddress(
        address,
        session,
        limit
      );
      const { result, pagination } = response;

      if (!result) throw Error("No transactions found.");

      return {
        status: Status.Success,
        action: BlockchainFunction.GetTransactionsByAddress,
        message: `Retrieved ${result.length} transactions for ${address}`,
        data: {
          transactions: result,
          pagination,
        },
      };
    } catch (e) {
      throw Error(`Error fetching transactions: ${e}`);
    }
  }

  /**
   * Fetches the contract ABI for a specified address using the Explorer API.
   *
   * @param {string} address - The contract address to retrieve the ABI for.
   * @returns {Promise<BlockchainFunctionResponse<GetContractAbiData>>} - The contract ABI data.
   * @memberof BlockchainService
   */
  async getContractABI(
    address: string
  ): Promise<BlockchainFunctionResponse<GetContractAbiData>> {
    try {
      const response = await this.explorerApi.getContractABI(address);
      const { result } = response;

      if (!result) throw Error("No Contract ABI found.");

      return {
        status: Status.Success,
        action: BlockchainFunction.GetContractABI,
        message: `Fetched ABI for contract at ${address}`,
        data: { abi: result },
      };
    } catch (e) {
      throw Error(`Error fetching contract ABI: ${e}`);
    }
  }

  /**
   * Creates a new wallet and increments the global wallet index.
   *
   * @returns {BlockchainFunctionResponse<CreateWalletData>} - The newly created wallet information.
   * @memberof BlockchainService
   */
  createWallet(): BlockchainFunctionResponse<CreateWalletData> {
    try {
      const walletPath = `m/44'/60'/0'/0/${GLOBAL_CONTEXT.walletMaxAccount}`;
      const wallet = ethers.HDNodeWallet.fromPhrase(
        this.options.wallet.mnemonic,
        walletPath
      );
      GLOBAL_CONTEXT.walletMaxAccount += 1;

      return {
        status: Status.Success,
        action: BlockchainFunction.CreateWallet,
        message: `New wallet created: ${wallet.address} (index: ${GLOBAL_CONTEXT.walletMaxAccount})`,
        data: {
          newWallet: {
            index: GLOBAL_CONTEXT.walletMaxAccount,
            address: wallet,
          },
        },
      };
    } catch (e) {
      throw Error(`Error creating wallet: ${e}`);
    }
  }

  /**
   * Fetches transaction details by its hash using the Explorer API.
   *
   * @param {string} txHash - The transaction hash.
   * @returns {Promise<BlockchainFunctionResponse<GetTransactionByHashData>>} - The transaction details.
   * @memberof BlockchainService
   */
  async getTransactionByHash(
    txHash: string
  ): Promise<BlockchainFunctionResponse<GetTransactionByHashData>> {
    try {
      const response = await this.explorerApi.getTransactionByHash(txHash);
      const { result } = response;
      const {
        blockNumber,
        from,
        to,
        value,
        gasPrice,
        nonce,
        transactionIndex,
        gas,
      } = result;

      if (!result) throw Error("No transaction found.");

      return {
        status: Status.Success,
        action: BlockchainFunction.GetTransactionByHash,
        message: `Retrieved details for transaction ${txHash}`,
        data: {
          blockNumber: blockNumber,
          from: from,
          to: to,
          value: ethers.formatUnits(value, Unit.Ether),
          gasPrice: ethers.formatUnits(gasPrice, Unit.Gwei),
          nonce: nonce,
          transactionIndex: parseInt(transactionIndex, 16),
          gas: parseInt(gas, 16),
        },
      };
    } catch (e) {
      throw Error(`Error fetching transaction: ${e}`);
    }
  }

  /**
   * Fetches block details by block numbers using the Explorer API.
   *
   * @param {string[]} blockNumbers - The block numbers to retrieve.
   * @param {boolean} txDetail - Whether to include detailed transaction data.
   * @returns {Promise<BlockchainFunctionResponse<GetBlockByNumberData>>} - The block information.
   * @memberof BlockchainService
   */
  async getBlocksByNumber(
    blockNumbers: string[],
    txDetail: boolean
  ): Promise<BlockchainFunctionResponse<GetBlockByNumberData>> {
    try {
      const blocks = await Promise.all(
        blockNumbers.map(async (block) => {
          const tag =
            block.startsWith("0x") ||
            ["earliest", "latest", "pending"].includes(block)
              ? block
              : "0x" + parseInt(block).toString(16);

          const response = await this.explorerApi.getBlockByNumber(
            tag,
            txDetail
          );
          const { result } = response;

          if (!result) throw Error("No block found.");

          return result;
        })
      );

      return {
        status: Status.Success,
        action: BlockchainFunction.GetBlocksByNumber,
        message: `Retrieved information for ${blocks.length} blocks`,
        data: { blocks },
      };
    } catch (e) {
      throw Error(`Error fetching blocks: ${e}`);
    }
  }

  /**
   * Fetches the status of a transaction by its hash using the Explorer API.
   *
   * @param {string} txHash - The transaction hash to check the status for.
   * @returns {Promise<any>} - The transaction status.
   * @memberof BlockchainService
   */
  async getTransactionStatus(
    txHash: string
  ): Promise<BlockchainFunctionResponse<GetTransactionStatusData>> {
    try {
      const response = await this.explorerApi.getStatus(txHash);
      const { result } = response;
      const { status, isError, errDescription } = result;

      if (!result) throw Error("No transaction status found.");

      return {
        status: Status.Success,
        action: BlockchainFunction.GetTransactionStatus,
        message: `Transaction status: ${
          status === 1 ? Status.Success : Status.Failed
        }`,
        data: {
          statusCode: status,
          isError: isError,
          errorDescription: errDescription || "N/A",
        },
      };
    } catch (e) {
      throw Error(`Error fetching transaction status: ${e}`);
    }
  }
}
