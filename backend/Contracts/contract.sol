// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuestReward {
    address public owner;
    mapping(address => uint256) public userCoins;

    event QuestCompleted(address indexed user, uint256 amount);

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to check that the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can reward");
        _;
    }

    // Function to complete a quest and reward a user
    function completeQuest(address user, uint256 reward) external onlyOwner {
        userCoins[user] += reward;
        emit QuestCompleted(user, reward);
    }

    // Function to get the balance of a user
    function getBalance(address user) external view returns (uint256) {
        return userCoins[user];
    }
}
