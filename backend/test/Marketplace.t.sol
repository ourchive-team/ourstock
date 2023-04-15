pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/Marketplace.sol";

contract MarketplaceTest is Test {
    Marketplace public marketplace;

    function setUp() public {
        marketplace = new Marketplace();
    }

    function testUploadImage(
        uint256 _price,
        string calldata _name,
        string calldata _description,
        string calldata _uri,
        uint256 _expiry
    ) public {
        vm.prank(msg.sender);
        marketplace.uploadImage(_price, _name, _description, _uri, _expiry);
    }
}
