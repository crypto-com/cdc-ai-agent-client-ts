import { QueryOptions, createClient } from './lib/client/index';

const OPEN_AI_API_KEY = '';
const CHAIN_ID = 388; // 25, 338, 388, 282

const CRONOS_MAINNET_API_KEY = '';
const CRONOS_TESTNET_API_KEY = '';
const CRONOS_ZKEVM_API_KEY = '';
const CRONOS_ZKEVM_TESTNET_API_KEY = '';

// Function to send a query and log the response
async function sendQuery(query: string) {
  // Create client params
  const clientParams: QueryOptions = {
    openAI: {
      apiKey: OPEN_AI_API_KEY,
      model: 'gpt-4o',
    },
    chainId: CHAIN_ID,
    explorerKeys: {
      cronosMainnetKey: CRONOS_MAINNET_API_KEY,
      cronosTestnetKey: CRONOS_TESTNET_API_KEY,
      cronosZkEvmKey: CRONOS_ZKEVM_API_KEY,
      cronosZkEvmTestnetKey: CRONOS_ZKEVM_TESTNET_API_KEY,
    },
    // signerAppUrl: 'https://my-signer-app', // Refer to: https://github.com/crypto-com/cdc-ai-agent-signer-app
    // customRPC: 'https://rpc.vvs.finance,
  };

  // Create a client instance
  const client = createClient(clientParams);
  try {
    console.log(`Sending query: "${query}"`);
    const response = await client.agent.generateQuery(query);
    console.log('CDC Agent AI Response:');
    console.log('Data:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error fetching CDC Agent AI response:', error);
  }
}

// Example usage
async function runExamples() {
  await sendQuery('Get the latest block number');
  await sendQuery('Get the block at 123');
  await sendQuery('send 0.01 TCRO to 0xc5bcb6df7d87ff88a03c70506949aab3ffc8580e', CHAIN_ID);
}

runExamples();
