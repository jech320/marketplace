pragma solidity ^0.4.24;

library SafeMathLib {
    function times(uint a, uint b) public pure returns (uint) {
        uint c = a * b;
        require(a == 0 || c / a == b);
        return c;
    }

    function minus(uint a, uint b) public pure returns (uint) {
        require(b <= a);
        return a - b;
    }

    function plus(uint a, uint b) public pure returns (uint) {
        uint c = a + b;
        require(c>=a && c>=b);
        return c;
    }
}