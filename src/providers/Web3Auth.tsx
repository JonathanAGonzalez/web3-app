import { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import {
  OpenloginAdapter,
  OpenloginUserInfo,
} from '@web3auth/openlogin-adapter';
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from '@web3auth/wallet-connect-v2-adapter';
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';
import RPC from '../web3Methods/RPCMethods';
import { showToast } from '../toast/toast';
import {
  Response,
  ResponseSendTransaction,
  Web3AuthContextType,
  Web3AuthProviderProps,
} from '../types/IWeb3';

const urlTransactionHash = import.meta.env.VITE_URL_HASH;

const initialState = {
  isLogged: false,
  provider: null,
  userData: null,
  isLoading: false,
  hashTransaction: null,
  connectWallet: () => {},
  disconnectWallet: () => {},
  getUserInfo: () => {},
  submitTransaction: () => {},
};

const rpc = import.meta.env.VITE_INFURA_RPC;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x5',
  rpcTarget: rpc,
  displayName: 'Goerli',
  blockExplorer: 'https://goerli.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ether',
};

const Web3AuthContext = createContext<Web3AuthContextType>(initialState);

export const Web3AuthProvider = ({ children }: Web3AuthProviderProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [hashTransaction, setHashTransaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getBalance() {
    if (!provider) return;
    const wallet = new RPC(provider);

    const balance = await wallet.getBalance();

    if (!balance) return null;

    return balance;
  }

  const getUserInfo = async () => {
    if (!web3Auth) {
      console.log('web3auth not initialized yet');
      return;
    }

    try {
      const user: Partial<OpenloginUserInfo> = await web3Auth.getUserInfo();
      if (!user) return console.log('user is null');

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const getWallet = async () => {
    if (!provider) {
      return;
    }

    try {
      const accounts: any = await provider.request({
        method: 'eth_accounts',
      });

      return accounts[0];
    } catch (error) {
      console.log(error);
    }
  };

  const submitTransaction = async (walletTo: string) => {
    if (!provider) {
      console.log('provider not initialized yet');
      return;
    }

    try {
      const rpc = new RPC(provider, walletTo);
      const signedMessage: Response = await rpc.signMessage();

      if (signedMessage.code === 4001) {
        console.log('signed message is null');
        return;
      }

      setIsLoading(true);
      const sendTransaction: ResponseSendTransaction =
        await rpc.sendTransaction();

      if (sendTransaction.blockHash) {
        setHashTransaction(
          `${urlTransactionHash}${sendTransaction.transactionHash}`
        );

        const newBalance = await getBalance();
        if (newBalance) setUserData({ ...userData, balance: newBalance });
      }
    } catch (error) {
      console.log(error);

      setHashTransaction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!web3Auth) {
      return;
    }

    try {
      const web3authProvider = await web3Auth.connect();
      setProvider(web3authProvider);
      getBalance();
      setIsLogged(true);
      getWallet();
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    if (!web3Auth) {
      console.log('No auth');
      return;
    }
    try {
      await web3Auth.logout();
      web3Auth.clearCache();
      showToast({
        type: 'success',
        text: 'Logout successfully',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLogged(false);
      setUserData(null);
    }
  };

  //Init Web3Auth
  useEffect(() => {
    (async () => {
      try {
        console.log('Initializing Web3Auth...');
        //New Instance of Web3Auth
        const web3auth = new Web3Auth({
          clientId: import.meta.env.VITE_WEB3_AUTH,
          chainConfig,
          authMode: 'DAPP',
          sessionTime: 3600, // 1 hour in seconds

          uiConfig: {
            appName: 'Web3Auth Demo',
            theme: 'dark',
            loginGridCol: 2,
            loginMethodsOrder: ['google', 'twitch'],
          },
        });

        //Metamask Adapter
        const metamaskLoginAdapter = new MetamaskAdapter({
          clientId: import.meta.env.VITE_WEB3_AUTH,
          sessionTime: 3600, // 1 hour in seconds
          web3AuthNetwork: 'testnet',
          chainConfig,
        });
        web3auth.configureAdapter(metamaskLoginAdapter);

        //Google Adapter and Twitch Adapter
        const googleLoginAdapter = new OpenloginAdapter({
          sessionTime: 3600, // 1 hour in seconds
          adapterSettings: {
            network: 'testnet',
            uxMode: 'popup',
            loginConfig: {
              google: {
                verifier: 'web3auth_google', // Pass the Verifier name here
                typeOfLogin: 'google', // Pass on the login provider of the verifier you've created
                clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Pass on the Google `Client ID` here
              },
              twitch: {
                verifier: 'web3-twitch', // Pass the Verifier name here
                typeOfLogin: 'twitch', // Pass on the login provider of the verifier you've created
                clientId: import.meta.env.VITE_TWITCH_CLIENT_ID, // Pass on the Twitch `Client ID` here
              },
            },
          },
        });
        web3auth.configureAdapter(googleLoginAdapter);

        //WalletConnect Adapter
        const defaultWcSettings = await getWalletConnectV2Settings(
          'eip155',
          [5],
          import.meta.env.VITE_WALLET_CONNECT_KEY
        );
        const walletConnectV2Adapter = new WalletConnectV2Adapter({
          adapterSettings: { ...defaultWcSettings.adapterSettings },
          loginSettings: { ...defaultWcSettings.loginSettings },
          web3AuthNetwork: 'testnet',
        });
        web3auth.configureAdapter(walletConnectV2Adapter);

        //Torus Adapter
        const torusWalletAdapter = new TorusWalletAdapter({
          clientId: import.meta.env.VITE_WEB3_AUTH,
        });
        web3auth.configureAdapter(torusWalletAdapter);

        //Init Modal
        await web3auth.initModal({
          modalConfig: {
            openlogin: {
              label: 'openlogin',
              loginMethods: {
                facebook: {
                  name: 'facebook',
                  showOnModal: false,
                },
                reddit: {
                  name: 'reddit',
                  showOnModal: false,
                },
                email_passwordless: {
                  name: 'email_passwordless',
                  showOnModal: false,
                },
                sms_passwordless: {
                  name: 'sms_passwordless',
                  showOnModal: false,
                },
                twitter: {
                  name: 'twitter',
                  showOnModal: false,
                },
                github: {
                  name: 'github',
                  showOnModal: false,
                },
                // google: {
                //   name: 'google',
                //   showOnModal: false,
                // },
                discord: {
                  name: 'discord',
                  showOnModal: false,
                },
                // twitch: {
                //   name: 'twitch',
                //   showOnModal: false,
                // },
                apple: {
                  name: 'apple',
                  showOnModal: false,
                },
                line: {
                  name: 'line',
                  showOnModal: false,
                },
                wechat: {
                  name: 'wechat',
                  showOnModal: false,
                },
                weibo: {
                  name: 'weibo',
                  showOnModal: false,
                },
                linkedin: {
                  name: 'linkedin',
                  showOnModal: false,
                },
                yahoo: {
                  name: 'yahoo',
                  showOnModal: false,
                },
                kakao: {
                  name: 'kakao',
                  showOnModal: false,
                },
              },
            },
          },
        });

        // set provider
        setProvider(web3auth.provider);

        // set web3Auth
        setWeb3Auth(web3auth);
      } catch (error) {
        showToast({
          type: 'error',
          text: 'Error initializing Web3Auth',
        });
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!web3Auth) return;

    setIsLogged(web3Auth.connected);
  }, [web3Auth]);

  useEffect(() => {
    const getInformation = async () => {
      const balance = await getBalance();
      const infoUser = (await getUserInfo()) || {};
      const wallet = await getWallet();

      setUserData(
        Object.keys(infoUser).length !== 0
          ? {
              ...infoUser,
              balance,
              wallet,
            }
          : {
              balance,
              wallet,
            }
      );
    };

    if (provider && isLogged) {
      getInformation();
    }
  }, [isLogged]);

  return (
    <Web3AuthContext.Provider
      value={{
        isLogged,
        provider,
        userData,
        isLoading,
        hashTransaction,
        connectWallet,
        disconnectWallet,
        getUserInfo,
        submitTransaction,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => useContext(Web3AuthContext);
