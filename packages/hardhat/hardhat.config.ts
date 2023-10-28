import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";
const flareRpcApiKey = process.env.FLARE_RPC_API_KEY || "";
const flarescanApiKey = process.env.FLARESCAN_API_KEY || "";
const USE_FLARESCAN = false;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
    },
  },
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    coston: {
      url: "https://coston-api.flare.network/ext/bc/C/rpc" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""),
      accounts: [deployerPrivateKey],
      chainId: 16,
    },
    coston2: {
      url: "https://coston2-api.flare.network/ext/C/rpc" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""),
      accounts: [deployerPrivateKey],
      chainId: 114,
    },
    songbird: {
      url: "https://songbird-api.flare.network/ext/bc/C/rpc" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""),
      accounts: [deployerPrivateKey],
      chainId: 19,
    },
    flare: {
      url: "https://flare-api.flare.network/ext/C/rpc" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""),
      accounts: [deployerPrivateKey],
      chainId: 14,
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    arbitrumGoerli: {
      url: `https://arb-goerli.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvm: {
      url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://polygonzkevm-testnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      zksync: true,
      accounts: [deployerPrivateKey],
      verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
    } as any,
    zkSync: {
      url: "https://mainnet.era.zksync.io",
      zksync: true,
      accounts: [deployerPrivateKey],
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    } as any,
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [deployerPrivateKey],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [deployerPrivateKey],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [deployerPrivateKey],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
  },

  verify: {
    etherscan: {
      apiKey: {
        goerli: `${etherscanApiKey}`,
        coston: `${flarescanApiKey}`,
        coston2: `${flarescanApiKey}`,
        songbird: `${flarescanApiKey}`,
        flare: `${flarescanApiKey}`,
        sepolia: `${etherscanApiKey}`,
      },
      customChains: [
        {
          network: "coston",
          chainId: 16,
          urls: {
            // faucet: https://faucet.towolabs.com/
            apiURL: "https://coston-explorer.flare.network/api" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""), // Must not have / endpoint
            browserURL: "https://coston-explorer.flare.network",
          },
        },
        {
          network: "coston2",
          chainId: 114,
          urls: {
            // faucet: https://coston2-faucet.towolabs.com/
            apiURL:
              "https://coston2-explorer.flare.network/api" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""), // Must not have / endpoint
            browserURL: "https://coston2-explorer.flare.network",
          },
        },
        {
          network: "songbird",
          chainId: 19,
          urls: {
            apiURL:
              "https://songbird-explorer.flare.network/api" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""), // Must not have / endpoint
            browserURL: "https://songbird-explorer.flare.network/",
          },
        },
        {
          network: "flare",
          chainId: 14,
          urls: {
            apiURL: "https://flare-explorer.flare.network/api" + (flareRpcApiKey ? `?x-apikey=${flareRpcApiKey}` : ""), // Must not have / endpoint
            browserURL: "https://flare-explorer.flare.network/",
          },
        },
      ],
    },
  },
};

if (USE_FLARESCAN) {
  const FLARESCAN_DATA = [
    {
      apiURL: "https://api.routescan.io/v2/network/testnet/evm/16/etherscan",
      browserURL: "https://coston.testnet.flarescan.com",
    },
    {
      apiURL: "https://api.routescan.io/v2/network/testnet/evm/114/etherscan",
      browserURL: "https://coston2.testnet.flarescan.com",
    },
    {
      apiURL: "https://api.routescan.io/v2/network/mainnet/evm/19/etherscan",
      browserURL: "https://songbird.flarescan.com",
    },
    {
      apiURL: "https://api.routescan.io/v2/network/mainnet/evm/14/etherscan",
      browserURL: "https://mainnet.flarescan.com",
    },
  ];

  for (let i = 0; i < FLARESCAN_DATA.length; i++) {
    if (config.etherscan?.customChains) config.etherscan.customChains[i].urls = FLARESCAN_DATA[i];
  }
}

export default config;
