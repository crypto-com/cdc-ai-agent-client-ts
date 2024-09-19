import { Provider } from "ethers";
import { CommandContext, Options } from "../core/ai-agent.interfaces.js";
import { ChainAiService } from "../core/ai-agent.service.js";
import { logger } from "../utils/logger.js";
import { Output } from "../lib/interfaces/httpEnums.js";

/**
 * Generates a response from the Chain AI service based on the provided query.
 *
 * @async
 * @function generateResponse
 * @param {string} query - The query string to be sent to the Chain AI.
 * @param {Options} options - Configuration options for the Chain AI service, including OpenAI API key, chain details, and explorer settings.
 * @param {Provider} provider - An instance of ethers.js Provider for interacting with the blockchain.
 * @returns {Promise<{ action: string, message: string, object: any }>} A promise that resolves to an object containing the AI-generated action, message, and data.
 *
 * @example
 * const response = await generateResponse('What is the latest block?', options, provider);
 * console.log(response);
 *
 */
export const generateResponse = async (
  query: string,
  options: Options,
  provider: Provider
): Promise<Output> => {
  try {
    const chainAiService = new ChainAiService(options, provider);

    let context: CommandContext[] = [];

    const [jsonResponse, updatedContext] = await chainAiService.processCommand(
      query,
      context
    );
    context = updatedContext;

    return {
      action: jsonResponse.action,
      message: jsonResponse.message,
      object: jsonResponse.data,
    };
  } catch (e) {
    logger.error("[generateResponse]: Error in generateQuery:", e);
    throw e;
  }
};
