// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuestReward {
    address public owner;
    mapping(address => uint256) public userCoins;

    event QuestCompleted(address indexed user, uint256 reward);

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to check that the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can reward");
        _;
    }

    // Function to complete a quest and reward a user with Ether
    function completeQuest(address user) external onlyOwner {
        uint256 reward = 1 ether; // Reward in Ether (can change as needed)
        userCoins[user] += reward;

        // Send Ether to the user
        payable(user).transfer(reward);

        emit QuestCompleted(user, reward);
    }

    // Function to get the balance of a user
    function getBalance(address user) external view returns (uint256) {
        return userCoins[user];
    }

    // Function to receive Ether to fund the contract
    receive() external payable {}
}
