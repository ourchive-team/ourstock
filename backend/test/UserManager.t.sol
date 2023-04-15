pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/UserManager.sol";

contract UserManagerTest is Test {
    UserManager public userManager;

    function setUp() public {
        userManager = new UserManager();
    }

    function testSetNickname(string memory _nickname) public {
        vm.assume(bytes(_nickname).length > 0);
        vm.prank(msg.sender);
        userManager.setUserNickname(msg.sender, _nickname);
        assertEq(
            keccak256(abi.encodePacked(userManager.getUserNickname(msg.sender))), keccak256(abi.encodePacked(_nickname))
        );
    }

    function testSetOtherUserNickname(string memory _nickname) public {
        vm.prank(msg.sender);
        vm.expectRevert(Unauthorized.selector);
        userManager.setUserNickname(address(0), _nickname);
    }

    function testSetEmptyNickname() public {
        vm.prank(msg.sender);
        vm.expectRevert(EmptyNicknameNotAllowed.selector);
        userManager.setUserNickname(msg.sender, "");
    }

    function testNicknameAlreadyExists(string memory _nickname) public {
        vm.assume(bytes(_nickname).length > 0);
        vm.prank(msg.sender);
        userManager.setUserNickname(msg.sender, _nickname);
        assertTrue(userManager.nicknameAlreadyExists(_nickname));
    }
}
