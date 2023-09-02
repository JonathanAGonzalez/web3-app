import './App.css';
import InputComponent from './components/Input.component';
import { Profile } from './components/Profile';
import { Spinner } from './components/Spinner';
import { ToastProvider } from './providers/Toast.provider';
import { useWeb3Auth } from './providers/Web3Auth';
import { showToast } from './toast/toast';
import { isWalletAddressValid } from './utils/isWalletAddressValid';
import { useState } from 'react';

function App() {
  const {
    connectWallet,
    disconnectWallet,
    submitTransaction,
    hashTransaction,
    isLoading,
    userData,
    isLogged,
  } = useWeb3Auth();

  const [amount, setAmount] = useState('');
  const [walletToSendEth, setWalletToSendEth] = useState('');

  const handleValues = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: any
  ) => {
    setState(e.target.value);
  };

  const submitTransactionAction = () => {
    const isValidWallet = isWalletAddressValid(walletToSendEth);

    if (!isValidWallet) {
      showToast({
        type: 'error',
        text: 'Wallet is not valid',
      });
      return;
    }
    submitTransaction(walletToSendEth);

    submitTransaction(walletToSendEth);
    setWalletToSendEth('');
  };

  return (
    <ToastProvider>
      <div>
        <h2 className="my-4 text-lg">Connect</h2>

        {userData && <Profile user={userData} />}

        <div className="my-4 flex flex-col items-start gap-4">
          {
            <button onClick={isLogged ? disconnectWallet : connectWallet}>
              {isLogged ? 'Logout' : 'Open Modal'}
            </button>
          }
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <InputComponent
            label=" 💵Value:"
            name="value"
            value={amount}
            onChange={(e) => handleValues(e, setAmount)}
          />

          <InputComponent
            label="📩Wallet to send ETH:"
            name="wallet"
            value={walletToSendEth}
            onChange={(e) => handleValues(e, setWalletToSendEth)}
          />

          {isLogged && (
            <button
              className="bg-[#646cff] text-white rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={submitTransactionAction}
            >
              Send Transaction
            </button>
          )}
        </div>
        {hashTransaction && (
          <div className="my-4 flex flex-col justify-start items-center gap-4 min-h-[100px] border rounded-md p-2">
            <h2>Transaction Hash</h2>
            {isLoading && <Spinner />}

            <a href={hashTransaction} target="_blank">
              Go to see the transaction
            </a>
          </div>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
