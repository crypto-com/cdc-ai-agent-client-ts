import axios from 'axios';
import { getBaseUrl } from '../helpers/explorer.helper.js';
import { logger } from '../../utils/logger.js';
import { Block, ExplorerResponse, Status, Transaction } from './explorer.interfaces.js';

/**
 * Explorer API class for managing Chain AI service API requests.
 *
 * @class ExplorerApi
 */
export class ExplorerApi {
  private apikey: string;
  private baseUrl: string;

  /**
   * @param {string} apikey - API key for authenticating requests.
   * @param {string} chain - The blockchain (e.g., cronos-evm, cronos-zkevm) that determines the base URL.
   * @memberof ExplorerApi
   */
  constructor(apikey: string, chain: string) {
    this.apikey = apikey;
    this.baseUrl = getBaseUrl(chain);
  }

  /**
   * Fetches transactions for a specified address.
   *
   * @param {string} address - The address for which to fetch transactions.
   * @param {string} session - The session token for paginated results.
   * @param {number} limit - The number of transactions to fetch.
   * @returns {Promise<ExplorerResponse<Transaction[]>>} - The list of transactions for the specified address.
   * @memberof ExplorerApi
   */
  async getTransactionsByAddress(
    address: string,
    session: string,
    limit: number
  ): Promise<ExplorerResponse<Transaction[]>> {
    const url = `${this.baseUrl}/api/v1/account/getTxsByAddress`;

    try {
      const response = await axios.get<ExplorerResponse<Transaction[]>>(url, {
        params: {
          address,
          session,
          limit,
          apikey: this.apikey,
        },
      });
      return response.data;
    } catch (e) {
      logger.error('[ExplorerApi/getTransactionsByAddress] error:', e);
      throw e;
    }
  }

  /**
   * Fetches the ABI for a specified contract.
   *
   * @param {string} address - The address of the contract to fetch the ABI for.
   * @returns {Promise<ExplorerResponse<string>>} - The ABI of the contract.
   * @memberof ExplorerApi
   */
  async getContractABI(address: string): Promise<ExplorerResponse<string>> {
    const url = `${this.baseUrl}/api/v1/contract/getAbi`;

    try {
      const response = await axios.get<ExplorerResponse<string>>(url, {
        params: {
          address,
          apikey: this.apikey,
        },
      });
      return response.data;
    } catch (e) {
      logger.error('[ExplorerApi/getContractABI] error:', e);
      throw e;
    }
  }

  /**
   * Fetches a transaction by its hash.
   *
   * @param {string} txHash - The transaction hash to search for.
   * @returns {Promise<ExplorerResponse<Transaction>>} - The transaction details.
   * @memberof ExplorerApi
   */
  async getTransactionByHash(txHash: string): Promise<ExplorerResponse<Transaction>> {
    const url = `${this.baseUrl}/api/v1/ethproxy/getTransactionByHash`;

    try {
      const response = await axios.get<ExplorerResponse<Transaction>>(url, {
        params: {
          txHash,
          apikey: this.apikey,
        },
      });
      return response.data;
    } catch (e) {
      logger.error('[ExplorerApi/getTransactionByHash] error:', e);
      throw e;
    }
  }

  /**
   * Fetches a block by its number or tag.
   *
   * @param {string} tag - The block number or tag (e.g., 'latest').
   * @param {boolean} txDetail - Whether to include detailed transaction data.
   * @returns {Promise<ExplorerResponse<Block>>} - The block details.
   * @memberof ExplorerApi
   */
  async getBlockByNumber(tag: string, txDetail: boolean): Promise<ExplorerResponse<Block>> {
    const url = `${this.baseUrl}/api/v1/ethproxy/getBlockByNumber`;

    try {
      const response = await axios.get<ExplorerResponse<Block>>(url, {
        params: {
          tag,
          txDetail,
          apikey: this.apikey,
        },
      });

      return response.data;
    } catch (e) {
      logger.error('[ExplorerApi/getBlockByNumber] error:', e);
      throw e;
    }
  }

  /**
   * Fetches the status of a transaction by its hash.
   *
   * @param {string} txHash - The transaction hash to search for.
   * @returns {Promise<ExplorerResponse<Status>>} - The status of the transaction.
   * @memberof ExplorerApi
   */
  async getStatus(txHash: string): Promise<ExplorerResponse<Status>> {
    const url = `${this.baseUrl}/api/v1/transaction/getStatus`;

    try {
      const response = await axios.get<ExplorerResponse<Status>>(url, {
        params: {
          txHash,
          apikey: this.apikey,
        },
      });

      return response.data;
    } catch (e) {
      logger.error('[ExplorerApi/getStatus] error:', e);
      throw e;
    }
  }
}
