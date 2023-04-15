pragma solidity ^0.8.17;

import "./Marketplace.sol";

contract OwnerProver {
    Marketplace marketplace;

    constructor(address _marketplace_addr) {
        marketplace = Marketplace(_marketplace_addr);
    }
}
