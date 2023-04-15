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
    uint256 public latest_id = 0;
    StockImage[] public stock_images;
    mapping(address => uint256[]) creator_to_stock_image_ids;

    constructor() ERC1155("") {}

    function uploadImage(
        uint256 price,
        string calldata name,
        string calldata description,
        string calldata uri,
        uint256 expiry
    ) external {
        StockImage memory new_image = StockImage({
            id: latest_id,
            name: name,
            description: description,
            uri: uri,
            price: price,
            creator: msg.sender,
            expiry: expiry
        });
        stock_images.push(new_image);
        creator_to_stock_image_ids[msg.sender].push(latest_id);
        latest_id++;
    }
}
