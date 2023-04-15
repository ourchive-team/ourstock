pragma solidity ^0.8.17;

error Unauthorized();
error EmptyNicknameNotAllowed();

contract UserManager {
    address[] public addresses;
    mapping(address => string) addressToNickname;

    function getUserNickname(address _account) external view returns (string memory) {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (addresses[i] == _account) {
                return addressToNickname[_account];
            }
        }
        revert("User not found");
    }

    function nicknameAlreadyExists(string calldata _nickname) external view returns (bool) {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (keccak256(abi.encodePacked(addressToNickname[addresses[i]])) == keccak256(abi.encodePacked(_nickname))) {
                return true;
            }
        }
        return false;
    }

    function setUserNickname(address _account, string calldata _nickname) public {
        if (msg.sender != _account) {
            revert Unauthorized();
        }
        if (bytes(_nickname).length == 0) {
            revert EmptyNicknameNotAllowed();
        }
        addressToNickname[_account] = _nickname;
        addresses.push(_account);
    }
}
