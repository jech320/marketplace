const ethers = require("ethers");
const IPFS = require("ipfs-api");
const EthersClient = require("./../models/EthersClient");
const Contract = require("./Contract");

const getContract = privateKey => {
  const provider = EthersClient.getRopsten();
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(Contract.address, Contract.abi, wallet);

  return contract;
};

const uploadImage = async buffer => {
  const ipfs = new IPFS({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https"
  });
  let result;

  try {
    result = await ipfs.add(buffer);
  } catch (error) {
    result = error;
  }

  return result;
};

const getWallet = () => JSON.parse(sessionStorage.getItem('wallet'));

const ropstenProvider = EthersClient.getRopsten();

export {
  getContract,
  uploadImage,
  getWallet,
  ropstenProvider
};
