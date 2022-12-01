// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; //Address of the user who has waved
        string message; // Message user sent
        uint256 timestamp;
    }

    Wave[] waves;
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("I am a wave PORTAL Smart contract.");
        //Set the initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        //Lets send some prize money honey
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmout = 0.0001 ether;
            //Require are like if statements
            require(
                prizeAmout <= address(this).balance,
                "Trying to withdraw more money than contract has"
            );
            //THis makes the fun transfer happen, look how weired is the statement
            (bool success, ) = (msg.sender).call{value: prizeAmout}("");
            //We'll get success true if the transfer happened
            require(success, "Failed to withdraw money from Contract");
            emit NewWave(msg.sender, block.timestamp, _message);
        }
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
}
