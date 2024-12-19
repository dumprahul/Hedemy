// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//Contract created at - 0x35ecd42d2b0038442277d3103da2DA6091c0215D
//This contract is deployed at Hedera Testnet
//Contract link- https://hashscan.io/testnet/contract/0.0.5288413?pf=1
//Transation on hashgraph Explorer- 0xe09eb0d969b53b0cb243f0d557f32a496a91e099779a5bf34c27af5850a4feec


contract HedemyStake {
    // State variables
    address public creator; // Address of the course creator
    mapping(address => uint256) public stakes; // Tracks user's staked amounts
    uint256 public totalStaked; // Tracks total staked in the contract

    // Events
    event Staked(address indexed user, uint256 amount);
    event CreatorPaid(address indexed creator, uint256 amount);
    event StakeReturned(address indexed user, uint256 amount);

    /// @dev Set the course creator at deployment
    constructor(address _creator) {
        require(_creator != address(0), "Invalid creator address");
        creator = _creator;
    }

    /// @dev Allows a user to stake an amount into the contract
    function stake() external payable {
        require(msg.value > 0, "Stake amount must be greater than 0");
        require(stakes[msg.sender] == 0, "Already staked");

        // Store the staked amount
        stakes[msg.sender] = msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    /// @dev Sends half of the staked amount to the course creator
    function return_creator() external {
        require(totalStaked > 0, "No amount staked in the contract");

        uint256 halfAmount = totalStaked / 2;

        // Reset total staked amount before transferring
        totalStaked -= halfAmount;

        // Send half of the staked amount to the creator
        (bool success, ) = creator.call{value: halfAmount}("");
        require(success, "Transfer to creator failed");

        emit CreatorPaid(creator, halfAmount);
    }

    /// @dev Returns the remaining half of the staked amount back to the staker
    function return_stake() external {
        uint256 stakedAmount = stakes[msg.sender];
        require(stakedAmount > 0, "No stake to return");

        uint256 halfAmount = stakedAmount / 2;

        // Reset the user's stake to prevent reentrancy
        stakes[msg.sender] = 0;

        // Send half of the stake back to the staker
        (bool success, ) = msg.sender.call{value: halfAmount}("");
        require(success, "Stake return failed");

        emit StakeReturned(msg.sender, halfAmount);
    }
}
