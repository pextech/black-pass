// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;


interface IStake {

    struct Stake {
        uint256 startTime;
        uint256 duration;
        uint256 reward;
        uint256 penalty;
        bool claimed;
        bool staked;
    }
    event Staked(address indexed owner, uint256 duration);
    event Unstaked(address indexed owner);
    event RewardClaimed(address indexed owner, uint256 amount);

}