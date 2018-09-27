const ethers = require('ethers');
const providers = ethers.providers;

class EthersClient {
  setNetwork(network) {
    this.network = network;
  }

  getInfuraProvider() {
    return new providers.InfuraProvider(this.network);
  }

  getEtherscanProvider() {
    return new providers.EtherscanProvider(this.network);
  }

  getLocalParityInstance(url) {
    return new providers.JsonRpcProvider(url, this.network);
  }

  getRopsten() {
    return providers.getDefaultProvider(this.network);
  }

  getProviderWithFallbacks(providers) {
    return new providers.FallbackProvider(providers);
  }
}

module.exports = EthersClient;