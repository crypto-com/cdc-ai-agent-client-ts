# Crypto.com AI Agent Client.ts

The Crypto.com AI Agent Client.ts is a TypeScript/JavaScript library designed to facilitate easy and efficient interactions with the Crypto.com AI Agent Service API. This client library provides methods to send queries and fetch responses from the Crypto.com AI Agent Service seamlessly.

![npm](https://img.shields.io/npm/v/@crypto.com/ai-agent-client)

## Features

- Simple and intuitive API for interacting with the Crypto.com AI Agent.
- Supports sending queries and receiving AI-generated responses.
- Configurable client instances tailored to your specific endpoint and security needs.
- **Currently in beta**: Expect frequent updates and potential changes in future releases.

## Installation

To install the package, run the following command in your project directory:

```bash
npm install @crypto.com/ai-agent-client
```

## Usage

Here’s how you can use the Crypto.com AI Agent Client in your project:

### Configuring the Client

```ts
import { QueryOptions, createClient } from '@crypto.com/ai-agent-client';

const queryOptions: QueryOptions = {
  openAI: {
    apiKey: <OPEN_AI_API_KEY>,
    model: 'gpt-4o',
  },
  chainId: 240, // # 25 for Cronos EVM Mainnet, 338 for Cronos EVM Testnet, 388 for Cronos ZkEVM Mainnet, 240 for Cronos ZkEVM Testnet
  explorerKeys: {
    cronosMainnetKey: <CRONOS_MAINNET_API_KEY>,
    cronosTestnetKey: <CRONOS_TESTNET_API_KEY>,
    cronosZkEvmKey: <CRONOS_ZKEVM_API_KEY>,
    cronosZkEvmTestnetKey: <CRONOS_ZKEVM_TESTNET_API_KEY>,
  },
  signerAppUrl: 'https://my-signer-app',
  context: [], // Optional context for the query. Context can be obtained from the server response.
};

const client = createClient(queryOptions);
```

### Sending a Query

```ts
const sendQuery = async (query) => {
  try {
    const response = await client.agent.generateQuery(query);
    console.log('Crypto.com AI Agent Response:', response);
  } catch (error) {
    console.error('Error sending query:', error);
  }
};
```

## API

### Client Methods

- `generateQuery(query)`: Generates a query that is send to the Crypto.com AI Agent Service and returns a response.

## Licensing

The code in this project is licensed under the MIT license.

## Contact

If you have any questions or comments about the library, please feel free to open an issue or a pull request on our GitHub repository.
