import { IuserData } from './IUser';
import { SafeEventEmitterProvider } from '@web3auth/base';

export interface Web3AuthProviderProps {
  children: React.ReactNode;
}

export interface Web3AuthContextType {
  isLogged: boolean;
  provider: SafeEventEmitterProvider | null;
  userData: IuserData | null;
  isLoading: boolean;
  hashTransaction: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  getUserInfo: () => void;
  submitTransaction: (walletToSendEth: string) => void;
}

export interface ResponseMetaMask {
  code?: number;
  message?: string;
  data?: string;
}

export type Response = string & ResponseMetaMask;

export interface ResponseSendTransaction {
  blockHash: string;
  blockNumber: number;
  contractAddress: null;
  cumulativeGasUsed: number;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logs: [];
  logsBloom: string;
  status: true;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}
