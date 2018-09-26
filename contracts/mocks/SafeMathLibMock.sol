pragma solidity ^0.4.24;

import { SafeMathLib } from "./../SafeMathLib.sol";

contract SafeMathLibMock {
  function multiply(uint a, uint b) public pure returns (uint) {
    return SafeMathLib.multiply(a, b);
  }

  function subtract(uint a, uint b) public pure returns (uint) {
    return SafeMathLib.subtract(a, b);
  }

  function add(uint a, uint b) public pure returns (uint) {
    return SafeMathLib.add(a, b);
  }
    
  function divide(uint a, uint b) public pure returns (uint256) {
    return SafeMathLib.divide(a, b);
  }
}