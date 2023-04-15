pragma solidity ^0.8.17;

error Unauthorized();

contract UserManager {
    mapping(address => string) userNicknames;

    function getUserNickname(address _id) external view returns (string memory) {
        return userNicknames[_id];
    }

    function setUserNickname(address _id, string memory _nickname) public {
        if (msg.sender != _id) {
            revert Unauthorized();
        }
        userNicknames[_id] = _nickname;
    }
}
