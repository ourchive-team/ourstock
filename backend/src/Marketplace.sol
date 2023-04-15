pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";

struct StockImage {
    uint256 id;
    string name;
    string description;
    string uri;
    uint256 price;
    address creator;
    uint256 expiry;
}

contract Marketplace is ERC1155 {
    StockImage[] public stock_images;

    constructor() ERC1155("") {}
}
