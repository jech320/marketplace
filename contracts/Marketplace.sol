pragma solidity ^0.4.24;

import { Ownable } from "./Ownable.sol";
import { SafeMathLib } from "./SafeMathLib.sol";

contract Marketplace is Ownable {
    enum Role { Buyer, Seller }
    string[] public roles;
    mapping (address => User) private users;
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
        string[] imageIpfsHashes;
        uint price;
    }
    
    modifier onlySeller() {
        require(users[msg.sender].role == Role.Seller,
            "Error: Seller only");
        _;
    }
    
    modifier onlyBuyer() {
        require(users[msg.sender].role == Role.Buyer,
            "Error: Buyer only");
        _;
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].role == Role.Buyer
            || users[msg.sender].role == Role.Seller,
            "Error: Registered users only");
        _;
    }
    
    modifier verifyItemsBoughtViewer(address buyerAddress) {
        require((isBuyer(buyerAddress) && isMatch(buyerAddress, msg.sender))
            || isSeller(msg.sender), "Error: Not allowed to view");
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
        string[] memory imageIpfsHashes;
        Item memory item = Item({
            name: name,
            description: description,
            imageIpfsHashes: imageIpfsHashes,
            price: price
        });

        users[msg.sender].itemsForSale.push(item);
    }
    
    function addImageForItemForSale(uint index, string imageIpfsHash)
        public
        onlySeller
    {
        users[msg.sender].itemsForSale[index].imageIpfsHashes.push(imageIpfsHash);
    }
    
    function getItemForSaleCount(address sellerAddress)
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
        return (users[sellerAddress].itemsForSale[itemIndex].imageIpfsHashes.length);
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
        return (users[sellerAddress].itemsForSale[itemIndex].imageIpfsHashes[imageIndex]);
    }

    function purchaseItem(
        address sellerAddress,
        uint itemIndex
    )
        public
        payable
        onlyBuyer
    {
        Item memory item = users[sellerAddress].itemsForSale[itemIndex];

        require(msg.value == item.price,
            "Input exact amount of item price to purchase");
        
        sellerAddress.transfer(item.price);
        removeItemForSale(sellerAddress, itemIndex);
        users[msg.sender].itemsBought.push(item);
    }
    
    function removeItemForSaleBySeller(uint index) public onlySeller {
        removeItemForSale(msg.sender, index);
    }
    
    function removeItemForSale(address sellerAddress, uint index)
        private
    {
        uint  arrLength = users[sellerAddress].itemsForSale.length;
        users[sellerAddress].itemsForSale[index] = users[sellerAddress].itemsForSale[arrLength - 1];
        users[sellerAddress].itemsForSale.length--;
    }
    
    function updateItemForSale(
        uint index,
        string name,
        string description,
        uint price
    ) public onlySeller {
        users[msg.sender].itemsForSale[index].name = name;
        users[msg.sender].itemsForSale[index].description = description;
        users[msg.sender].itemsForSale[index].price = price;
    }
    
    function removeItemForSaleImage(uint itemIndex, uint imageIndex)
        public
        onlySeller
    {
        uint arrLength = users[msg.sender].itemsForSale[itemIndex].imageIpfsHashes.length;
        string memory lastImageHash = users[msg.sender].itemsForSale[itemIndex].imageIpfsHashes[arrLength - 1];
        users[msg.sender].itemsForSale[itemIndex].imageIpfsHashes[imageIndex] = lastImageHash;
        users[msg.sender].itemsForSale[itemIndex].imageIpfsHashes.length--;
    }
    
    function getSellerContact(address sellerAddress)
        public
        view
        onlyRegistered
        returns (string, string)
    {
        Contact memory sellerContact = users[sellerAddress].contact;
        return (sellerContact.email, sellerContact.number);
    }
    
    function isSeller(address addr) public view returns (bool) {
        return users[addr].role == Role.Seller;
    }
    
    function isBuyer(address addr) public view returns (bool) {
        return users[addr].role == Role.Buyer;
    }
    
    function isMatch(address addr1, address addr2) public pure returns (bool) {
        return addr1 == addr2;
    }
    
    function getItemBought(address buyerAddress, uint index)
        public
        view
        verifyItemsBoughtViewer(buyerAddress)
        returns (string, string, uint)
    {
        return (
            users[buyerAddress].itemsBought[index].name,    
            users[buyerAddress].itemsBought[index].description,
            users[buyerAddress].itemsBought[index].price
        );
    }
    
    function getItemBoughtImageCount(
        address buyerAddress,
        uint itemIndex
    )
        public
        view
        verifyItemsBoughtViewer(buyerAddress)
        returns (uint)
    {
        return (users[buyerAddress].itemsForSale[itemIndex].imageIpfsHashes.length);
    }
    
    function getItemBoughtImage(
        address buyerAddress,
        uint itemIndex,
        uint imageIndex
    )
        public
        view
        verifyItemsBoughtViewer(buyerAddress)
        returns (string)
    {
        return (users[buyerAddress].itemsForSale[itemIndex].imageIpfsHashes[imageIndex]);
    }
}