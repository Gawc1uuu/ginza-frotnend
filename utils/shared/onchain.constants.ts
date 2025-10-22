export const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const ARBITRUM_USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const ETHEREUM_SEPOLIA_USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
export const ETHEREUM_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const OPTIMISM_USDC = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
export const SOLANA_DEVNET_USDC = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
export const SOLANA_USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export enum Blockchains {
    ethereum = 'ethereum',
    base = 'base',
    solana = 'solana',
    arbitrum = 'arbitrum',
    optimism = 'optimism',
}

export enum Networks {
    sepolia = 'sepolia',
    mainnet = 'mainnet',
    devnet = 'devnet',
}


export type Chain = {
    id: string;
    blockchain: Blockchains;
    network: Networks;
}

export const ETHEREUM: Chain = {
    id: '1',
    blockchain: Blockchains.ethereum,
    network: Networks.mainnet,
}

export const BASE: Chain = {
    id: '8453',
    blockchain: Blockchains.base,
    network: Networks.mainnet,
}

export const ARBITRUM: Chain = {
    id: '42161',
    blockchain: Blockchains.arbitrum,
    network: Networks.mainnet,
}

export const OPTIMISM: Chain = {
    id: '10',
    blockchain: Blockchains.optimism,
    network: Networks.mainnet,
}

export const SOLANA: Chain = {
    id: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
    blockchain: Blockchains.solana,
    network: Networks.mainnet,
}

export const ETHEREUM_SEPOLIA: Chain = {
    id: '11155111',
    blockchain: Blockchains.ethereum,
    network: Networks.sepolia,
}

export const SOLANA_DEVNET: Chain = {
    id: "GH7ome3EiwEr7tu9JuTh2dpYWBJK3z69Xm1ZE3MEE6JC",
    blockchain: Blockchains.solana,
    network: Networks.devnet,
}

const SUPPORTED_CHAINS = [
    ETHEREUM,
    BASE,
    ARBITRUM,
    OPTIMISM,
    SOLANA,
];

const SUPPORTED_TEST_CHAINS = [
    ETHEREUM_SEPOLIA,
    SOLANA_DEVNET,
];

export const getSupportedChains = (isTestnet?: boolean) => {
    if (isTestnet) {
        return SUPPORTED_TEST_CHAINS;
    }
    return SUPPORTED_CHAINS;
}

export const SUPPORTED_WITHDRAWAL_TOKENS: Record<string, string[]> = {
    [BASE.id]: [BASE_USDC],
    [ARBITRUM.id]: [ARBITRUM_USDC],
    [OPTIMISM.id]: [OPTIMISM_USDC],
    [ETHEREUM.id]: [ETHEREUM_USDC],
    [SOLANA.id]: [SOLANA_USDC],
    [ETHEREUM_SEPOLIA.id]: [ETHEREUM_SEPOLIA_USDC],
    [SOLANA_DEVNET.id]: [SOLANA_DEVNET_USDC],
};

export const SUPPORTED_DEPOSIT_TOKENS: Record<string, string[]> = {
    [BASE.id]: [BASE_USDC.toLowerCase()],
    [ARBITRUM.id]: [ARBITRUM_USDC.toLowerCase()],
    [OPTIMISM.id]: [OPTIMISM_USDC.toLowerCase()],
    [ETHEREUM.id]: [ETHEREUM_USDC.toLowerCase()],
    [SOLANA.id]: [SOLANA_USDC],
    [ETHEREUM_SEPOLIA.id]: [ETHEREUM_SEPOLIA_USDC.toLowerCase()],
    [SOLANA_DEVNET.id]: [SOLANA_DEVNET_USDC],
};

type ChainInfo = {
    name: string;
    icon: string;
    explorer: string;
};


export const CHAIN_INFO: Record<string, ChainInfo> = {
  
    [ETHEREUM.id]: {
      name: "Ethereum",
      icon: "/icons/chains/ethereum.svg",
      explorer: "https://etherscan.io",
    },
    [BASE.id]: {
      name: "Base",
      icon: "/icons/chains/base.svg",
      explorer: "https://basescan.org",
    },
    [ARBITRUM.id]: {
      name: "Arbitrum",
      icon: "/icons/chains/arbitrum.svg",
      explorer: "https://arbiscan.io",
    },
    [OPTIMISM.id]: {
      name: "Optimism",
      icon: "/icons/chains/optimism.svg",
      explorer: "https://optimistic.etherscan.io",
    },
  
    [SOLANA.id]: {
      name: "Solana",
      icon: "/icons/chains/solana.svg",
      explorer: "https://explorer.solana.com",
    },
  
    [ETHEREUM_SEPOLIA.id]: {
      name: "Ethereum Sepolia",
      icon: "/icons/chains/ethereum.svg",
      explorer: "https://sepolia.etherscan.io",
    },
    [SOLANA_DEVNET.id]: {
      name: "Solana Devnet",
      icon: "/icons/chains/solana.svg",
      explorer: "https://explorer.solana.com",
    },
  };
  


export type VaultodyResponse<T> = {
    apiVersion: string;
    requestId: string;
    context: string;
    data: T;
  }
  
  export type AssetsResponse = VaultodyResponse<{
    limit: number;
    startingAfter: string;
    hasMore: boolean;
    item: {
        assets: Array<{
            assetData: {
                allocatedAmount: string;
                availableAmount: string;
                blockedAmount: string;
                contract: string;
                standard: string;
                totalAmount: string;
            };
            assetId: string;
            blockchain: Blockchains;
            exchangeRate: string;
            network: Networks;
            symbol: string;
            type: string;
        }>;
    }
  }>