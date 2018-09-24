pragma solidity ^0.4.24;

library SafeMathLib {
    function multiply(uint a, uint b) public pure returns (uint) {
        uint c = a * b;
        require(a == 0 || c / a == b);
        return c;
    }

    function subtract(uint a, uint b) public pure returns (uint) {
        require(b <= a);
        return a - b;
    }

    function add(uint a, uint b) public pure returns (uint) {
        uint c = a + b;
        require(c>=a && c>=b);
        return c;
    }
    
    function divide(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }
}