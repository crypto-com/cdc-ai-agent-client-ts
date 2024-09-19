export const sendTransactionParameters = {
  type: 'object',
  properties: {
    to_address: { type: 'string', description: "Recipient's Ethereum address" },
    amount: { type: 'number', description: 'Amount of Ether to send' },
  },
  required: ['to_address', 'amount'],
};

export const listWalletsParameters = {
  type: 'object',
  properties: {},
};

export const getBalanceParameters = {
  type: 'object',
  properties: {
    walletAddresses: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of Ethereum addresses to check balances',
    },
  },
  required: ['walletAddresses'],
};

export const getLatestBlockParameters = {
  type: 'object',
  properties: {},
};

export const getTransactionsByAddressParameters = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      description: 'Cronos address to get transactions for',
    },
    session: {
      type: 'string',
      description: 'Previous page session. Leave empty for first page',
    },
    limit: {
      type: 'number',
      description: 'Page size (max 100)',
      minimum: 1,
      maximum: 100,
      default: 20,
    },
  },
  required: ['address'],
};

export const getContractAbiParameters = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      description: 'Contract address to get ABI for',
    },
  },
  required: ['address'],
};

export const getTransactionByHash = {
  type: 'object',
  properties: {
    txHash: {
      type: 'string',
      description: 'Transaction hash to get details for',
    },
  },
  required: ['txHash'],
};

export const getBlockByNumberParameters = {
  type: 'object',
  properties: {
    blockNumbers: {
      type: 'array',
      items: { type: 'string' },
      description: "List of block numbers in hex, or 'earliest', 'latest', or 'pending'",
    },
    txDetail: {
      type: 'boolean',
      description: 'If true, returns full transaction objects; if false, only transaction hashes',
      default: false,
    },
  },
  required: ['blockNumbers'],
};

export const getTransactionStatusParameters = {
  type: 'object',
  properties: {
    txHash: {
      type: 'string',
      description: 'Transaction hash to get status for',
    },
  },
  required: ['txHash'],
};

export const createWalletParameters = {
  type: 'object',
  properties: {},
};
