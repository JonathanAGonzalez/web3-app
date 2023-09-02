import Web3 from 'web3';

export const isWalletAddressValid = (address: string): boolean => {
  const web3 = new Web3();
  return web3.utils.isAddress(address);
};
