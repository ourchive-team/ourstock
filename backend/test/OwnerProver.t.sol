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
    }

    function testSubmitReportForNonexistentImage() public {
        vm.prank(creatorAddress);
        vm.expectRevert(IncorrectImageTitle.selector);
        ownerProver.submitReport(creatorNickname, "incorrectImageTitle", "testPhrase");
    }
}
