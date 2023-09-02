import { SafeEventEmitterProvider } from '@web3auth/base';
import { ethers } from 'ethers';
import Web3 from 'web3';

export default class RPC {
  private provider: SafeEventEmitterProvider;
  walletTo: string;
  constructor(provider: SafeEventEmitterProvider, walletTo?: string) {
    this.provider = provider;
    this.walletTo = walletTo || '';
  }

  async sendTransaction(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];
      const walletTo = this.walletTo;

      const isWallet = web3.utils.isAddress(walletTo);

      const amount = web3.utils.toWei('0.001');
      //   const amount = '1000000000000000';

      if (!isWallet) {
        console.log('No destination address');
        throw new Error('No destination address');
      }

      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: walletTo,
        value: amount,
        gas: '21000', // Gas limit
        // maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
        // maxFeePerGas: '6000000000000', // Max fee per gas
      });

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage() {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const originalMessage =
        'You must sign this message to submit the transaction.';

      console.log({ fromAddress });

      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        'test password!' // configure your own password here.
      );

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async getBalance() {
    try {
      const web3 = new Web3(this.provider as any);
      const fromAddress = (await web3.eth.getAccounts())[0];

      const balance = await web3.eth.getBalance(fromAddress);

      return web3.utils.fromWei(balance);
    } catch (error) {
      console.log(error);
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      return await address;
    } catch (error) {
      return error;
    }
  }
}
