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
  
  static recoverFromPrivateKey(privateKey) {
    return new ethers.Wallet(privateKey);
  }

  static recoverFromMnemonic(mnemonic) {
    return ethers.Wallet.fromMnemonic(mnemonic);
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