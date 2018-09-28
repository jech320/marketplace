const ethers = require('ethers');
const providers = ethers.providers;

class EthersClient {
  static getInfuraProvider(network) {
    return new providers.InfuraProvider(network);
  }

  static getEtherscanProvider(network) {
    return new providers.EtherscanProvider(network);
  }

  static getLocalParityInstance(url, network) {
    return new providers.JsonRpcProvider(url, network);
  }

  static getRopsten() {
    return providers.getDefaultProvider('ropsten');
  }

  static getProviderWithFallbacks(providers) {
    return new providers.FallbackProvider(providers);
  }
}

module.exports = EthersClient;