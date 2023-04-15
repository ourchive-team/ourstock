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

    function testUploadImageWithDuplicatedName() public {
        vm.prank(msg.sender);
        marketplace.uploadImage(
            1000,
            "test",
            "test",
            "https://example.com",
            1000
        );
        vm.prank(msg.sender);
        vm.expectRevert(DuplicatedImageName.selector);
        marketplace.uploadImage(
            1000,
            "test",
            "image of duplicate name",
            "https://example.com",
            1000
        );
    }

    function testPurchaseImage() public {
        vm.prank(msg.sender);
        marketplace.uploadImage(
            1000,
            "test",
            "test",
            "https://example.com",
            1000
        );
        assertEq(marketplace.latest_id(), 1);
        vm.prank(msg.sender);
        marketplace.purchaseImage{value: 5000}(0);
    }

    function testFailPurchaseNonExistentImage() public {
        vm.prank(msg.sender);
        marketplace.purchaseImage(1);
    }
}
