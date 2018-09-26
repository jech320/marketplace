var Marketplace = artifacts.require("./Marketplace.sol");
var SafeMathLib = artifacts.require("./SafeMathLib.sol");
var SafeMathLibMock = artifacts.require("./mocks/SafeMathLibMock.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMathLib);
  deployer.link(SafeMathLib, Marketplace);
  deployer.link(SafeMathLib, SafeMathLibMock);
  deployer.deploy(SafeMathLibMock);
  deployer.deploy(Marketplace);
};
