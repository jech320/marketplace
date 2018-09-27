const ethers = require('ethers');

class Wallet {
  constructor(privateKey) {
    if (privateKey) {
      this.recoverFromPrivateKey(privateKey);
    } else {
      this.generateWallet();
    }
  }

  generateWallet() {
    const wallet = ethers.Wallet.createRandom();

    this.setCredentials(wallet);
  }
  
  recoverFromPrivateKey(privateKey) {
    const wallet = ethers.Wallet(privateKey);

    this.setCredentials(wallet);
  }

  recoverFromMnemonic(mnemonic) {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    this.setCredentials(wallet);
  }

  setCredentials({ address, mnemonic, derivationPath, privateKey }) {
    this.address = address;
    this.mnemonic = mnemonic;
    this.path = derivationPath;
    this.privateKey = privateKey;
  }

  signTransaction(transaction) {
    const wallet = ethers.Wallet(this.privateKey);

    return wallet.sign(transaction);
  }
}

module.exports = Wallet;