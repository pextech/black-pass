// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Counters } from "./openzeppelin/contracts/utils/Counters.sol";
import "./HederaTokenService.sol";
import "./openzeppelin/contracts/utils/math/SafeMath.sol";
import { IStake } from "../Interfaces/IStake.sol";

contract stakingContract is ReentrancyGuard, IStake, HederaTokenService {
    using Counters for Counters.Counter;

    Counters.Counter public goldSupply;
    Counters.Counter public silverSupply;
    Counters.Counter public bronzeSupply;
    Counters.Counter public collectionCount;
    Counters.Counter public nftsCount;

     using SafeMath for uint256;
    mapping (address => Stake) public stakes;

    uint256 public totalStaked;
    uint256 public totalRewards;

    constructor(){
    }

    function stake(uint256 _duration) external {
        require(_duration == 60 || _duration == 90 || _duration == 120, "Invalid duration");

        Stake storage stakeData = stakes[msg.sender];
        require(!stakeData.staked, "Already staked");

        stakeData.startTime = block.timestamp;
        stakeData.duration = _duration;
        stakeData.reward = 0;
        stakeData.penalty = 0;
        stakeData.staked = true;
        stakeData.claimed = false;

        totalStaked += 1;

        emit Staked(msg.sender, _duration);
    }

    function unstakeNFT() external{
        Stake storage stakeData = stakes[msg.sender];
        require(stakeData.staked, "Not staked");
        require(!stakeData.claimed, "already claimed");

        uint256 endTime = stakeData.startTime + stakeData.duration;
        uint256 penalty = 0;

        if (block.timestamp < endTime) {
            penalty = stakeData.penalty;
        }

        uint256 reward = 0;

        if(penalty == 0){
            if (stakeData.duration == 60) {
            reward = 10;
            } else if (stakeData.duration == 90) {
            reward =  20;
            } else if (stakeData.duration == 120) {
            reward =  30;
            } else {
            reward =  0;
            }
        }
  
        stakeData.reward = reward;
        stakeData.penalty = penalty;
        stakeData.claimed = true;
        totalRewards += reward;
        emit RewardClaimed(msg.sender, reward);
        

        emit Unstaked(msg.sender);
    }

}