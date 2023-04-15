pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";

error DuplicatedImageName();
error ImageNotFound();

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
    mapping(address => uint256[]) owner_to_stock_image_ids;

    constructor() ERC1155("") {}

    function uploadImage(
        uint256 price,
        string calldata name,
        string calldata description,
        string calldata uri,
        uint256 expiry
    ) external {
        checkDuplicateName(msg.sender, name);
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

    function checkDuplicateName(address creator, string calldata name) private view {
        uint256[] memory image_ids = creator_to_stock_image_ids[creator];

        for (uint256 i = 0; i < image_ids.length; i++) {
            string memory image_name = stock_images[image_ids[i]].name;
            if (keccak256(abi.encodePacked(image_name)) == keccak256(abi.encodePacked(name))) {
                revert DuplicatedImageName();
            }
        }
    }

    function purchaseImage(uint256 _image_id) external payable {
        require(_image_id < latest_id, "Image not found");

        uint256 price = stock_images[_image_id].price;
        require(msg.value >= price, "Not enough eth");

        // transfer eth to creator
        address creator = stock_images[_image_id].creator;
        payable(creator).transfer(price);

        // refund exceeded eth
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        // mint the stock image to the buyer
        _mint(msg.sender, _image_id, 1, "");
        owner_to_stock_image_ids[msg.sender].push(_image_id);
    }

    function getImageByCreatorAndName(address _creator, string calldata _image_name)
        external
        view
        returns (StockImage memory)
    {
        uint256[] memory creator_image_ids = creator_to_stock_image_ids[_creator];
        for (uint256 i = 0; i < creator_image_ids.length; i++) {
            string memory image_name = stock_images[creator_image_ids[i]].name;
            if (keccak256(abi.encodePacked(image_name)) == keccak256(abi.encodePacked(_image_name))) {
                return stock_images[creator_image_ids[i]];
            }
        }
        revert ImageNotFound();
    }

    function getUploadedImages(address _creator) external view returns (StockImage[] memory) {
        uint256[] memory image_ids = creator_to_stock_image_ids[_creator];
        StockImage[] memory result = new StockImage[](image_ids.length);
        uint256 result_idx = 0;

        for (uint256 i = 0; i < image_ids.length; i++) {
            result[result_idx++] = stock_images[image_ids[i]];
        }

        return result;
    }

    function getPurchasedImages(address _owner) external view returns (StockImage[] memory) {
        uint256[] memory image_ids = owner_to_stock_image_ids[_owner];
        StockImage[] memory result = new StockImage[](image_ids.length);
        uint256 result_idx = 0;

        for (uint256 i = 0; i < image_ids.length; i++) {
            result[result_idx++] = stock_images[image_ids[i]];
        }

        return result;
    }
}
