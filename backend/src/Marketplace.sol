pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";

contract Marketplace is ERC1155 {
    constructor() ERC1155("") {}
}
