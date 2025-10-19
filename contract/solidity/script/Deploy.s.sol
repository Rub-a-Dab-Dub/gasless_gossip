// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GaslessGossipPayments.sol";

contract DeployGaslessGossipPayments is Script {
    function run() external {
        // Get deployment parameters from environment variables
        address admin = vm.envAddress("ADMIN_ADDRESS");
        address paymentToken = vm.envAddress("PAYMENT_TOKEN_ADDRESS");
        uint16 platformFeeBps = uint16(vm.envUint("PLATFORM_FEE_BPS"));

        // Start broadcasting transactions
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        GaslessGossipPayments payments = new GaslessGossipPayments(admin, paymentToken, platformFeeBps);

        console.log("GaslessGossipPayments deployed to:", address(payments));
        console.log("Admin:", admin);
        console.log("Payment Token:", paymentToken);
        console.log("Platform Fee (bps):", platformFeeBps);

        vm.stopBroadcast();
    }
}
