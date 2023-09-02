import { createAlchemyWeb3 } from '@alch/alchemy-web3';

export async function sendTransaction() {
  try {
    //   const web3 = createAlchemyWeb3(import.meta.env.VITE_API_URL);
    const web3 = createAlchemyWeb3(
      'https://eth-goerli.g.alchemy.com/v2/rIgigl9d1nJQoouDyLiFMFdksoPeEJPw'
    );

    const myAddress = '0x8Ab4d923D0b24D0E3a488b9eA0D5F276D6c76569'; //TODO: replace this address with your own public address

    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');

    console.log(nonce); // nonce starts counting from 0

    const transaction = {
      to: '0xdEB5d0F6fc32F14799EFd0B28c2CAde774288750', // faucet address to return eth
      value: 1000000000000000, // 1 ETH
      gas: 30000,
      nonce: nonce,
      // optional data field to send message or execute smart contract
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      //   import.meta.env.VITE_PRIVATE_KEY
      'd49772c942a066e46f3216bb0a9ee757a0661360419f805833e2e2d6bc379bfe'
    );

    if (!signedTx.rawTransaction) throw new Error('No raw transaction');

    web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error, hash) {
        if (!error) {
          console.log(
            '🎉 The hash of your transaction is: ',
            hash,
            "\n Check Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log(
            '❗Something went wrong while submitting your transaction:',
            error
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
