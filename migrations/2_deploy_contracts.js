var Marketplace = artifacts.require("./Marketplace.sol");
var SafeMathLib = artifacts.require("./SafeMathLib.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMathLib);
  deployer.link(SafeMathLib, Marketplace);
  deployer.deploy(Marketplace);
};
