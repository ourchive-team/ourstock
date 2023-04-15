pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/UserManager.sol";
import "../src/Marketplace.sol";
import "../src/OwnerProver.sol";

contract OwnerProverTest is Test {
    UserManager public userManager;
    OwnerProver public ownerProver;
    Marketplace public marketplace;

    address public creatorAddress = address(0);
    string public creatorNickname = "I'm a Creator";
    string public purchaserNickname = "I'm a Purchaser";

    function setUp() public {
        userManager = new UserManager();
        marketplace = new Marketplace();
        ownerProver = new OwnerProver(address(marketplace));

        vm.prank(creatorAddress);
        userManager.setUserNickname(creatorAddress, creatorNickname);

        vm.prank(creatorAddress);
        marketplace.uploadImage(1000, "testName", "testDesc", "https://example.com", 1000);
        vm.prank(creatorAddress);
        marketplace.uploadImage(1000, "testName2", "testDesc2", "https://example.com", 1000);

        vm.prank(msg.sender);
        marketplace.purchaseImage{value: 5000}(0);
    }

    function testSubmitReportForNonexistentImage() public {
        vm.prank(creatorAddress);
        vm.expectRevert(IncorrectImageTitle.selector);
        ownerProver.submitReport(creatorNickname, "incorrectImageTitle", "testPhrase");
    }

    function testSubmitReport() public {
        vm.prank(creatorAddress);
        ownerProver.submitReport(creatorNickname, "testName", "testPhrase");
    }

    function testProveOwnershipWithIncorrectPhrase() public {
        vm.prank(creatorAddress);
        ownerProver.submitReport(creatorNickname, "testName", "testPhrase");

        vm.prank(msg.sender);
        vm.expectRevert(IncorrectPhrase.selector);
        ownerProver.proveOwnership(purchaserNickname, creatorNickname, "testName", "incorrectPhrase");
    }

    function testProveOwnershipWithIncorrectImageTitle() public {
        vm.prank(creatorAddress);
        vm.expectRevert(IncorrectImageTitle.selector);
        ownerProver.submitReport(creatorNickname, "incorrectImageTitle", "testPhrase");
    }

    function testProveOwnershipUserNotImageOwner() public {
        vm.prank(creatorAddress);
        ownerProver.submitReport(creatorNickname, "testName2", "testPhrase");

        vm.prank(msg.sender);
        vm.expectRevert(UserNotImageOwner.selector);
        ownerProver.proveOwnership(purchaserNickname, creatorNickname, "testName2", "testPhrase");
    }

    function testProveOwnership() public {
        vm.prank(creatorAddress);
        ownerProver.submitReport(creatorNickname, "testName", "testPhrase");

        vm.prank(msg.sender);
        ownerProver.proveOwnership(purchaserNickname, creatorNickname, "testName", "testPhrase");
    }

    function testGetReportList() public {
        vm.prank(creatorAddress);
        ownerProver.submitReport(creatorNickname, "testName", "testPhrase");

        ReportElement[] memory result = ownerProver.getReportList(creatorNickname);
        assertEq(result.length, 1);
    }

    function testGetProofList() public {
        testProveOwnership();

        vm.prank(msg.sender);
        ProofElement[] memory result = ownerProver.getProofList(purchaserNickname);
        assertEq(result.length, 1);
    }
}
