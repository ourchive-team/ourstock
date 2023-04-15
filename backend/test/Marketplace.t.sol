pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/Marketplace.sol";

contract MarketplaceTest is Test {
    Marketplace public marketplace;

    function setUp() public {
        marketplace = new Marketplace();
    }
}
