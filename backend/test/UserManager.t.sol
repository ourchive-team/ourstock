pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/UserManager.sol";

contract UserManagerTest is Test {
    UserManager public userManager;

    function setUp() public {
        userManager = new UserManager();
    }

    function testSetNickname(string memory _nickname) public {
        userManager.setUserNickname(msg.sender, _nickname);
        assertEq(
            keccak256(abi.encodePacked(userManager.getUserNickname(msg.sender))), keccak256(abi.encodePacked(_nickname))
        );
    }
}
