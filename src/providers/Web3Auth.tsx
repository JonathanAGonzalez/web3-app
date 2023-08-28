import { createContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { SafeEventEmitterProvider } from '@web3auth/base';

interface Web3AuthContextType {
  isLogged: boolean;
  wallet: string;
  connectWallet: () => void;
  //   web3: any;
  //   account: string;
  //   disconnectWeb3: () => void;
}

interface Web3AuthProviderProps {
  children: React.ReactNode;
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export const Web3AuthProvider = ({ children }: Web3AuthProviderProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [isLogged, setIsLogged] = useState(false);
  const [wallet, setWallet] = useState('');

  const connectWallet = async () => {
    if (!web3Auth) return;
    await web3Auth.connect();
    setIsLogged(true);
  };

  //Init Web3Auth
  useEffect(() => {
    (async () => {
      const web3auth = new Web3Auth({
        clientId: import.meta.env.VITE_WEB3_AUTH, // Get your Client ID from Web3Auth Dashboard
        chainConfig: {
          chainNamespace: 'eip155',
          chainId: '0x1', // Please use 0x5 for Goerli Testnet
          rpcTarget: 'https://rpc.ankr.com/eth',
        },
      });

      try {
        //init modal
        await web3auth.initModal();
        // set provider
        setProvider(web3auth.provider);
        // set web3Auth
        setWeb3Auth(web3auth);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Web3AuthContext.Provider value={{ isLogged, wallet, connectWallet }}>
      {children}
    </Web3AuthContext.Provider>
  );
};
