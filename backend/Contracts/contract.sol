// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuestReward {
    address public owner;
    mapping(address => uint256) public userCoins;
    
    // New event for coin redemption
    event CoinsRedeemed(address indexed user, uint256 amount);

    event QuestCompleted(address indexed user, uint256 reward);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can reward");
        _;
    }

    function completeQuest(address user) external onlyOwner {
        uint256 reward = 1 ether;
        require(address(this).balance >= reward, "Not enough Ether in contract");

        userCoins[user] += reward;
        payable(user).transfer(reward);
        emit QuestCompleted(user, reward);
    }

    // New function to redeem coins for products
    function redeemCoins(address user, uint256 amount) external {
        require(userCoins[user] >= amount * 1 ether, "Insufficient coin balance");

        userCoins[user] -= amount * 1 ether;
        emit CoinsRedeemed(user, amount);
    }

    function getBalance(address user) external view returns (uint256) {
        return userCoins[user];
    }

    receive() external payable {}
}