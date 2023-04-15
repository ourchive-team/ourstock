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
}
