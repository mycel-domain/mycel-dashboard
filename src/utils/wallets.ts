import { onboarding } from "@dydxprotocol/v4-client-js";
import { ChainInfo } from "@keplr-wallet/types";
import { WalletType as CosmosWalletType } from "graz";
import { MYCEL_BASE_COIN_UNIT, MYCEL_HUMAN_COIN_UNIT, MYCEL_COIN_DECIMALS } from "@/utils/coin";
import MetamaskIcon from "@/assets/icons/wallets/metamask.svg";
import CoinbaseWalltIcon from "@/assets/icons/wallets/coinbase-wallet.svg";
import GenericWalletWalltIcon from "@/assets/icons/wallets/generic-wallet.svg";
import KeplrIcon from "@/assets/icons/wallets/keplr.svg";
import WalletConnectIcon from "@/assets/icons/wallets/walletconnect.svg";
import OKXIcon from "@/assets/icons/wallets/okx.svg";
import BitGetIcon from "@/assets/icons/wallets/bitget.png";

export type EvmAddress = `0x${string}`;
export type MycelAddress = `mycel${string}`;

export const EVM_CHAINID = 1;

export type PrivateInformation = ReturnType<typeof onboarding.deriveHDKeyFromEthereumSignature>;

export const BECH32_PREFIX = "mycel";

export const MYCEL_CHAIN_INFO: ChainInfo = {
  rpc: import.meta.env.VITE_WS_TENDERMINT ?? "",
  rest: import.meta.env.VITE_API_COSMOS ?? "",
  chainId: import.meta.env.VITE_CHAIN_ID ?? "",
  chainName: import.meta.env.VITE_CHAIN_NAME ?? "",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: BECH32_PREFIX,
    bech32PrefixAccPub: BECH32_PREFIX + "pub",
    bech32PrefixValAddr: BECH32_PREFIX + "valoper",
    bech32PrefixValPub: BECH32_PREFIX + "valoperpub",
    bech32PrefixConsAddr: BECH32_PREFIX + "valcons",
    bech32PrefixConsPub: BECH32_PREFIX + "valconspub",
  },
  currencies: [
    {
      coinDenom: MYCEL_HUMAN_COIN_UNIT,
      coinMinimalDenom: MYCEL_BASE_COIN_UNIT,
      coinDecimals: MYCEL_COIN_DECIMALS,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: MYCEL_HUMAN_COIN_UNIT,
      coinMinimalDenom: MYCEL_BASE_COIN_UNIT,
      coinDecimals: MYCEL_COIN_DECIMALS,
    },
  ],
  stakeCurrency: {
    coinDenom: MYCEL_HUMAN_COIN_UNIT,
    coinMinimalDenom: MYCEL_BASE_COIN_UNIT,
    coinDecimals: MYCEL_COIN_DECIMALS,
  },
  beta: true,
};

export const WALLET_CONFIG = {
  MetaMask: {
    id: "injected",
    name: "Injected",
    display: "EVM Wallet",
    chainType: "evm",
    icon: [MetamaskIcon, CoinbaseWalltIcon, GenericWalletWalltIcon],
    getUrl: "https://metamask.io/download.html",
    showMobile: true,
  },
  WalletConnect: {
    id: "walletConnect",
    name: "WalletConnect",
    display: "Wallet Connect",
    chainType: "evm",
    icon: WalletConnectIcon,
    getUrl: "",
    showMobile: true,
  },
  OKXWallet: {
    id: "okx",
    name: "OKXWallet",
    display: "OKX Wallet",
    chainType: "evm",
    icon: OKXIcon,
    getUrl: "https://www.okx.com/web3",
    showMobile: true,
  },
  BitGetWallet: {
    id: "bitget",
    name: "BitGetWallet",
    display: "BitGet Wallet",
    chainType: "evm",
    icon: BitGetIcon,
    getUrl: "https://web3.bitget.com",
    showMobile: true,
  },
  Keplr: {
    id: CosmosWalletType.KEPLR,
    name: "Keplr",
    display: "Keplr",
    chainType: "cosmos",
    icon: KeplrIcon,
    getUrl: "https://www.keplr.app/download",
    showMobile: false,
  },
  // KeplrMobile: {
  //   id: CosmosWalletType.WC_KEPLR_MOBILE,
  //   name: "KeplrMobile",
  //   display: "Keplr Mobile",
  //   chainType: "cosmos",
  //   icon: KeplrIcon,
  //   getUrl: "https://www.keplr.app/download",
  //   showMobile: true,
  //   hidePC: true,
  // },
};

export type WalletType = keyof typeof WALLET_CONFIG;

export const getSignTypedData = () =>
  ({
    primaryType: "mycel",
    domain: {
      name: "Mycel Chain",
    },
    types: {
      mycel: [{ name: "action", type: "string" }],
    },
    message: {
      action: "Mycel Chain Authentication",
    },
  }) as const;

export const shortAddress = (address: string | undefined, prefix = 8, suffix = 4) => {
  if (!address) return "";
  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
};
