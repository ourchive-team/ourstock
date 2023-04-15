pragma solidity ^0.8.17;

import "./Marketplace.sol";

error IncorrectImageTitle();
error IncorrectPhrase();
error UserNotImageOwner();

struct ReportElement {
    uint256 imageId;
    bool proved;
    uint256 timestamp;
    string phrase;
}

struct ProofElement {
    uint256 imageId;
    string phrase;
    uint256 timestamp;
}

contract OwnerProver {
    Marketplace marketplace;
    mapping(string => ReportElement[]) creatorToReports;
    mapping(string => ProofElement[]) userNicknameToProofs;

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

        // Add the report to creatorToReports
        ReportElement[] storage reports = creatorToReports[creatorName];
        reports.push(ReportElement(targetImage.id, false, block.timestamp, phrase));
    }

    function proveOwnership(
        string calldata userName,
        string calldata creatorName,
        string calldata imageTitle,
        string calldata phrase
    ) external {
        ReportElement[] storage creatorReports = creatorToReports[creatorName];
        uint256 reportIdx = getCreatorReportIdx(creatorName, phrase);

        if (reportIdx == creatorReports.length) {
            revert IncorrectPhrase();
        }

        ReportElement storage creatorReport = creatorReports[reportIdx];

        // Check the image title
        (, string memory name,,,,,) = marketplace.stock_images(creatorReport.imageId);
        if (!areSameStrings(name, imageTitle)) {
            revert IncorrectImageTitle();
        }

        // Check if the image is in the user's purchase list
        if (!checkUserPurchasedImage(msg.sender, creatorReport.imageId)) {
            revert UserNotImageOwner();
        }

        ProofElement[] storage userProofs = userNicknameToProofs[userName];
        userProofs.push(ProofElement(creatorReport.imageId, phrase, block.timestamp));
        creatorReport.proved = true;
    }

    // View functions
    function getReportList(string memory creatorName) external view returns (ReportElement[] memory) {
        return creatorToReports[creatorName];
    }

    // Util functions
    function getCreatorReportIdx(string calldata creatorName, string calldata phrase) internal view returns (uint256) {
        ReportElement[] memory creatorReports = creatorToReports[creatorName];
        uint256 result = creatorReports.length;

        for (uint256 i = 0; i < creatorReports.length; i++) {
            if (areSameStrings(creatorReports[i].phrase, phrase)) {
                result = i;
                break;
            }
        }

        return result;
    }

    function checkUserPurchasedImage(address user, uint256 imageId) internal view returns (bool) {
        StockImage[] memory purchasedImages = marketplace.getPurchasedImages(user);
        (uint256 targetImageId, string memory targetImageName,,,,,) = marketplace.stock_images(imageId);

        for (uint256 i = 0; i < purchasedImages.length; i++) {
            StockImage memory purchasedImage = purchasedImages[i];
            if (purchasedImage.id == targetImageId && areSameStrings(purchasedImage.name, targetImageName)) {
                return true;
            }
        }

        return false;
    }

    function areSameStrings(string memory s1, string memory s2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }
}
