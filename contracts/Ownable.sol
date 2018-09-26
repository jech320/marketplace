pragma solidity ^0.4.24;

contract Ownable {
    event LogChangeOfOwnership(
      address indexed owner,
      address newOwner
    );

    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;

        emit LogChangeOfOwnership(owner, newOwner);
    }
}