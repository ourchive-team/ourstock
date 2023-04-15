pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/UserManager.sol";
import "../src/Marketplace.sol";
import "../src/OwnerProver.sol";

contract OurstockDeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UserManager userManager = new UserManager();
        console.log("userManager deployed!:", address(userManager));
        Marketplace marketplace = new Marketplace();
        console.log("marketplace deployed!:", address(marketplace));
        OwnerProver ownerProver = new OwnerProver(address(marketplace));
        console.log("ownerProver deployed!:", address(ownerProver));

        vm.stopBroadcast();
    }
}
