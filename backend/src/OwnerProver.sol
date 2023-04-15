pragma solidity ^0.8.17;

import "./Marketplace.sol";

error IncorrectImageTitle();
error IncorrectPhrase();

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

    constructor(address marketplaceAddr) {
        marketplace = Marketplace(marketplaceAddr);
    }

    function submitReport(string calldata creatorName, string calldata imageTitle, string calldata phrase) external {
        StockImage[] memory uploadedImages = marketplace.getUploadedImages(msg.sender);
        StockImage memory targetImage;
        bool found = false;

        // Find the target image
        for (uint256 i = 0; i < uploadedImages.length; i++) {
            if (areSameStrings(imageTitle, uploadedImages[i].name)) {
                targetImage = uploadedImages[i];
                found = true;
                break;
            }
        }

        if (!found) {
            revert IncorrectImageTitle();
        }

        // Add the report to creatorReportTable
        mapping(string => ReportElement) storage reports = creatorReportTable[creatorName];
        string[] storage creatorPhraseList = creatorPhraseListTable[creatorName];
        if (reports[phrase].timestamp == 0) {
            // timestamp is 0 if reports[phrase] is empty. antipattern. FIXME
            reports[phrase] = ReportElement(targetImage.id, false, block.timestamp, phrase);
            creatorPhraseList.push(phrase);
        }
    }

    function proveOwnership(
        string calldata userName,
        string calldata creatorName,
        string calldata imageTitle,
        string calldata phrase
    ) external {
        // Get the creator's report list
        mapping(string => ReportElement) storage creatorReportMap = creatorReportTable[creatorName];

        // Check the phrase, FIXME
        ReportElement storage creatorReport = creatorReportMap[phrase];
        if (creatorReport.timestamp == 0) {
            revert IncorrectPhrase();
        }

        // Check the image title
        (, string memory name,,,,,) = marketplace.stock_images(creatorReport.imageId);
        if (areSameStrings(name, imageTitle)) {
            revert IncorrectImageTitle();
        }
    }

    // Util functions
    function areSameStrings(string memory s1, string memory s2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }
}
