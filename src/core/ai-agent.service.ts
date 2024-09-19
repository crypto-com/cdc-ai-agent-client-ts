import { OpenAI } from "openai";
import {
  AIMessageResponse,
  CommandContext,
  CommandResult,
  FunctionArgs,
  Options,
  Role,
} from "./ai-agent.interfaces.js";
import { BlockchainService } from "./blockchain/blockchain.service.js";
import { Provider } from "ethers";
import {
  BlockchainFunction,
  BlockchainFunctionResponse,
  BlockchainFunctionType,
  Status,
} from "./blockchain/blockchain.interfaces.js";
import { ChatCompletionMessageParam } from "openai/resources/index.js";
import { logger } from "../utils/logger.js";
import {
  CONTENT,
  RESULT_PLACEHOLDER,
  TOOLS,
} from "./constants/ai-agent.constants.js";

/**
 * ChainAiService class handles Chain AI operations.
 *
 * @class ChainAiService
 */
export class ChainAiService {
  private options: Options;
  private provider: Provider;
  private client: OpenAI;

  /**
   * @param {Options} options - Configuration options including wallet and chain details.
   * @param {Provider} provider - The provider to interact with the blockchain.
   */
  constructor(options: Options, provider: Provider) {
    this.options = options;
    this.provider = provider;
    this.client = new OpenAI({ apiKey: options.openAI.apiKey });
  }

  /**
   * Process the user command and return blockchain results.
   *
   * @param command - The user's command (e.g., "get balance").
   * @param context - The conversation context.
   * @returns - A Promise resolving to a tuple with the command result and updated context.
   * @memberof ChainAiService
   */
  public async processCommand(
    command: string,
    context: CommandContext[]
  ): Promise<[CommandResult, CommandContext[]]> {
    const messages: Array<ChatCompletionMessageParam> = [
      {
        role: Role.System,
        content: CONTENT,
      },
      ...context,
      { role: Role.User, content: command },
    ];

    const response = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      tools: TOOLS,
      tool_choice: "auto",
    });

    const aiMessage = response.choices[0].message as AIMessageResponse;
    let result: CommandResult = RESULT_PLACEHOLDER;

    if (aiMessage.tool_calls) {
      for (const toolCall of aiMessage.tool_calls) {
        const functionCall = toolCall.function;
        const functionArgs = JSON.parse(functionCall.arguments);
        const functionResult = await this.executeFunction(
          functionCall.name,
          functionArgs
        );
        result = { ...result, ...functionResult };

        if (functionResult.message) {
          result.message = functionResult.message;
        }
        if (functionResult.data) {
          result.data = functionResult.data;
        }
        if (functionResult.action) {
          result.action = functionResult.action;
        }
      }
    } else {
      result.message = aiMessage.content;
    }

    context = this.updateContext(context, command, result.message);
    return [result, context];
  }

  /**
   * Execute a blockchain function based on its name.
   *
   * @param functionName - The blockchain function to execute.
   * @param functionArgs - The arguments required for the function.
   * @returns - A Promise resolving to the blockchain function response.
   * @memberof ChainAiService
   */
  private async executeFunction(
    functionName: string,
    functionArgs: FunctionArgs
  ): Promise<BlockchainFunctionResponse<BlockchainFunctionType>> {
    const blockchainService = new BlockchainService(
      this.options,
      this.provider
    );

    try {
      switch (functionName) {
        case BlockchainFunction.SendTransaction:
          return await blockchainService.sendTransaction(
            functionArgs.toAddress,
            functionArgs.amount
          );
        case BlockchainFunction.ListWallets:
          return await blockchainService.listWallets();
        case BlockchainFunction.GetBalance:
          return await blockchainService.getBalance(
            functionArgs.walletAddresses
          );
        case BlockchainFunction.GetLatestBlock:
          return await blockchainService.getLatestBlock();
        case BlockchainFunction.GetTransactionsByAddress:
          return await blockchainService.getTransactionsByAddress(
            functionArgs.address,
            functionArgs.session,
            functionArgs.limit
          );
        case BlockchainFunction.GetContractABI:
          return await blockchainService.getContractABI(functionArgs.address);
        case BlockchainFunction.GetTransactionByHash:
          return await blockchainService.getTransactionByHash(
            functionArgs.txHash
          );
        case BlockchainFunction.GetBlocksByNumber:
          return await blockchainService.getBlocksByNumber(
            functionArgs.blockNumbers,
            functionArgs.txDetail
          );
        case BlockchainFunction.GetTransactionStatus:
          return await blockchainService.getTransactionStatus(
            functionArgs.txHash
          );
        case BlockchainFunction.CreateWallet:
          return blockchainService.createWallet();
        default:
          return {
            status: Status.Failed,
            action: "actionFailed",
            message: `Unknown function: ${functionName}`,
          };
      }
    } catch (e) {
      logger.error(
        `[ChainAiProcessor/executeFunction] error: Error executing function ${functionName}:`,
        e
      );
      return {
        status: Status.Failed,
        action: "actionFailed",
        message: `Failed to execute ${functionName}: ${e}`,
      };
    }
  }

  /**
   * Updates the conversation context with the user's command and the AI's response.
   *
   * @param context - The current conversation context.
   * @param command - The user's command.
   * @param response - The AI's response.
   * @returns - The updated context.
   * @memberof ChainAiService
   */
  private updateContext(
    context: CommandContext[],
    command: string,
    response: string
  ): CommandContext[] {
    context.push({ role: Role.User, content: command });
    context.push({ role: Role.Assistant, content: response });
    if (context.length > 10) context.shift();
    return context;
  }
}
