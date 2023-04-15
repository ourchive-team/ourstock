pragma solidity ^0.8.17;

error Unauthorized();
error EmptyNicknameNotAllowed();

contract UserManager {
    string[] public nicknames;
    mapping(address => uint256) userNicknameIds;

    function getUserNickname(address _account) external view returns (string memory) {
        return nicknames[userNicknameIds[_account]];
    }

    function nicknameAlreadyExists(string memory _nickname) external view returns (bool) {
        for (uint256 i = 0; i < nicknames.length; i++) {
            if (keccak256(abi.encodePacked(nicknames[i])) == keccak256(abi.encodePacked(_nickname))) {
                return true;
            }
        }
        return false;
    }

    function setUserNickname(address _account, string memory _nickname) public {
        if (msg.sender != _account) {
            revert Unauthorized();
        }
        if (bytes(_nickname).length == 0) {
            revert EmptyNicknameNotAllowed();
        }
        userNicknameIds[_account] = nicknames.length;
        nicknames.push(_nickname);
    }
}
