pragma solidity ^0.4.24;

library SafeMathLib {
    function multiply(uint a, uint b) public pure returns (uint) {
        if (a == 0) {
          return 0;
        }
        
        uint c = a * b;
        require(c / a == b);

        return c;
    }

    function subtract(uint a, uint b) public pure returns (uint) {
        require(b <= a);
        return a - b;
    }

    function add(uint a, uint b) public pure returns (uint) {
        uint c = a + b;
        require(c >= a && c >= b);
        return c;
    }
    
    function divide(uint a, uint b) public pure returns (uint256) {
        uint c = a / b;
        return c;
    }
}