// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuestReward {
    address public owner;
    mapping(address => uint256) public userCoins;
    
    //สร้าง event coinredeem ขึ้นมา
    event CoinsRedeemed(address indexed user, uint256 amount);

    event QuestCompleted(address indexed user, uint256 reward);

    // เมื่อ deploy จะทำการ set ค่า public key ของ owner อัตโนมัติ

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can reward");
        _;
    }


    // เมื่อมีการทำ transaction จะทำการ add 1 ether เข้าไปยัง address ที่ส่งเข้าไป

    function completeQuest(address user) external onlyOwner {
        uint256 reward = 1 ether;
        require(address(this).balance >= reward, "Not enough Ether in contract");

        userCoins[user] += reward;
        payable(user).transfer(reward);
        emit QuestCompleted(user, reward);
    }

    // ฟังก์ชันเพื่อลดจำนวณ credit ซึ่งไว้ใช้ในหน้า product 
    function redeemCoins(address user, uint256 amount) external {
        require(userCoins[user] >= amount * 1 ether, "Insufficient coin balance");

        userCoins[user] -= amount * 1 ether;
        emit CoinsRedeemed(user, amount);
    }

    // เรียกจำนวณ credit ที่เหลือ
    function getBalance(address user) external view returns (uint256) {
        return userCoins[user];
    }

    receive() external payable {}
}