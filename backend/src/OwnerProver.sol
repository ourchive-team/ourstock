pragma solidity ^0.8.17;

import "./Marketplace.sol";

error IncorrectImageTitle();

struct ReportElement {
    uint256 imageId;
    bool proved;
    uint256 timestamp;
    string phrase;
}

contract OwnerProver {
    Marketplace marketplace;
    mapping(string => mapping(string => ReportElement)) creatorReportTable;
    mapping(string => string[]) private creatorPhraseListTable;

    constructor(address _marketplace_addr) {
        marketplace = Marketplace(_marketplace_addr);
    }

    function submitReport(string calldata _creator_name, string calldata _image_title, string calldata phrase)
        external
    {
        StockImage[] memory uploaded_images = marketplace.getUploadedImages(msg.sender);
        StockImage memory target_image;
        bool image_found = false;

        // Find the target image
        for (uint256 i = 0; i < uploaded_images.length; i++) {
            if (keccak256(abi.encodePacked(_image_title)) == keccak256(abi.encodePacked(uploaded_images[i].name))) {
                target_image = uploaded_images[i];
                image_found = true;
                break;
            }
        }

        if (!image_found) {
            revert IncorrectImageTitle();
        }

        // Add the report to creatorReportTable
        mapping(string => ReportElement) storage reports = creatorReportTable[_creator_name];
        string[] storage creatorPhraseList = creatorPhraseListTable[_creator_name];
        if (reports[phrase].timestamp == 0) {
            // timestamp is 0 if reports[phrase] is empty. antipattern. FIXME
            reports[phrase] = ReportElement(target_image.id, false, block.timestamp, phrase);
            creatorPhraseList.push(phrase);
        }
    }
}
