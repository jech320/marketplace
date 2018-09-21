pragma solidity ^0.4.24;

import { Ownable } from "./Ownable.sol";
import { SafeMathLib } from "./SafeMathLib.sol";

contract Marketplace is Ownable {
    enum Role { Buyer, Seller }
    string[] public roles;
    mapping (address => User) public users;
    address[] public userAddressIndices;
    
    constructor() public {
        roles.push("Buyer");
        roles.push("Seller");
    }
    
    struct User {
        Role role;
        Contact contact;
        Item[] itemsBought;
        Item[] itemsForSale;
    }
    
    struct Contact {
        string email;
        string number;
    }
    
    struct Item {
        string name;
        string description;
        string[] ipfsHash;
        uint price;
    }
    
    modifier onlySeller() {
        require(users[msg.sender].role == Role.Seller,
            "Seller only");
        _;
    }
    
    modifier onlyBuyer() {
        require(users[msg.sender].role == Role.Buyer,
            "Buyer only");
        _;
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].role == Role.Buyer
            || users[msg.sender].role == Role.Seller,
            "Registered users only");
        _;
    }
    
    function registerUser(Role role, string email, string number) public {
        users[msg.sender].role = role;
        users[msg.sender].contact.email = email;
        users[msg.sender].contact.number = number;
        userAddressIndices.push(msg.sender);
    }
    
    function addItemForSale(string name, string description, uint price)
        public
        onlySeller
    {
        string[] memory ipfsHash;
        Item memory item = Item({
            name: name,
            description: description,
            ipfsHash: ipfsHash,
            price: price
        });

        users[msg.sender].itemsForSale.push(item);
    }
    
    function addImageForItemForSale(uint index, string ipfsHash)
        public
        onlySeller
    {
        users[msg.sender].itemsForSale[index].ipfsHash.push(ipfsHash);
    }
    
    function itemForSaleCount(address sellerAddress)
        public
        view
        onlyRegistered
        returns (uint)
    {
        return users[sellerAddress].itemsForSale.length;
    }
    
    function getItemForSale(address sellerAddress, uint index)
        public
        view
        onlyRegistered
        returns (string, string, uint)
    {
        return (
            users[sellerAddress].itemsForSale[index].name,    
            users[sellerAddress].itemsForSale[index].description,
            users[sellerAddress].itemsForSale[index].price
        );
    }
    
    function getItemForSaleImageCount(
        address sellerAddress,
        uint itemIndex
    )
        public
        view
        onlyRegistered
        returns (uint)
    {
        return (users[sellerAddress].itemsForSale[itemIndex].ipfsHash.length);
    }
    
    function getItemForSaleImage(
        address sellerAddress,
        uint itemIndex,
        uint imageIndex
    )
        public
        view
        onlyRegistered
        returns (string)
    {
        return (users[sellerAddress].itemsForSale[itemIndex].ipfsHash[imageIndex]);
    }

    // TODO
    // function purchaseItem(
    //     address sellerAddress,
    //     uint itemIndex
    // )
    //     public
    //     onlyBuyer
    // {
    //     Item memory itemBought = users[sellerAddress].itemsForSale[itemIndex];
    // }
    
    // TODO
    // function removeItemForSale(uint index) public {
        
    // }
    
    function getSellerContact(address sellerAddress)
        public
        view
        onlyRegistered
        returns (string, string)
    {
        Contact memory sellerContact = users[sellerAddress].contact;
        return (sellerContact.email, sellerContact.number);
    }
}