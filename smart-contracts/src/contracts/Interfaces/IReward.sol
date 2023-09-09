// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

interface IReward {

    struct Reward {
        uint256 id;
        int64 amount;
        bool claimable;
        bool claimed;
        address playerAddress;
        uint256 timestamp;
        string tier;
    }

    struct Tiers{
        uint256 id;
        string name;
    }

    function allRewards() external view returns (Reward[] memory);
    function addReward(uint256 tier, address playerAddress, int64 amount) external returns (Reward memory);
    function toggleClaimableStatus(uint256 _id, bool claimable) external returns(Reward memory);
    function claimReward(uint256 _id, bytes[] memory metadata, string memory _tokenURI) external returns(Reward memory);
    function playerRewards(address playerAddress) external returns(Reward[] memory);


}