// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./HederaTokenService.sol";
import { IPlayer } from "./Interfaces/IPlayer.sol";
import { INFT } from "./Interfaces/INfts.sol";
import { IReward } from "./Interfaces/IReward.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ExpiryHelper.sol";
import "./KeyHelper.sol";

contract blackPass is IPlayer, INFT, IReward, ReentrancyGuard, Ownable,  HederaTokenService, ExpiryHelper, KeyHelper {

    using Counters for Counters.Counter;

    Counters.Counter public nftsCount;
    Counters.Counter public playersCount;
    Counters.Counter public rewardsCount;
    Counters.Counter public tiersCount;



    mapping (address => Player) public _players;
    mapping (uint256 => Reward) public _rewards;
    mapping (uint256 => Tiers) public _tiers;
    mapping (address => NFT) public _nfts;

    address public blackPassCollection;

    bool blackPassCollectionGenerated = false;

    constructor(){
    }

    modifier isTokensGenerated (){
        require(blackPassCollectionGenerated, "Black Pass collection not yet generated");
        _;
    }

    function playerRewards(address playerAddress) public view returns (Reward[] memory) {
      uint rewardCount = rewardsCount.current();
      uint currentIndex = 0;

      Reward[] memory rewards = new Reward[](rewardCount);
      for (uint i = 0; i < rewardCount; i++) {
        if (_rewards[i + 1].playerAddress == playerAddress) {
          uint currentId = i + 1;
          Reward storage currentReward = _rewards[currentId];
          rewards[currentIndex] = currentReward;
          currentIndex += 1;
        }
      }
      return rewards;
    }

    function allRewards() public view onlyOwner override returns (Reward[] memory){
        uint256 currentIndex = 0;

        Reward[] memory RewardArray = new Reward[](rewardsCount.current());

        for (uint256 i = 0; i < rewardsCount.current(); i++) {
                uint256 currentId = i + 1;
                Reward storage currentReward = _rewards[currentId];
                RewardArray[currentIndex] = currentReward;
                currentIndex += 1;
        }
        return RewardArray;
    }

    function allTiers() public view onlyOwner returns (Tiers[] memory){
        uint256 currentIndex = 0;

        Tiers[] memory TierArray = new Tiers[](tiersCount.current());

        for (uint256 i = 0; i < tiersCount.current(); i++) {
                uint256 currentId = i + 1;
                Tiers storage currentTier = _tiers[currentId];
                TierArray[currentIndex] = currentTier;
                currentIndex += 1;
        }
        return TierArray;
    }

    function setPlayer(string memory _name, address playerAddress, string memory username, string memory email, string memory twitter, string memory discord, string memory telegram) public onlyOwner override returns (Player memory) {
        Player memory player;

        playersCount.increment();
        player.id = playersCount.current();
        player.name = _name;
        player.email = email;
        player.username = username;
        player.playerAddress = playerAddress;
        player.active = true;
        player.telegram = telegram;
        player.twitter = twitter;
        player.discord = discord;
        player.reedemed = false;
        _players[playerAddress] = player;
        return player;
    }

    function addTier(string memory name) public onlyOwner returns (Tiers memory) {
        Tiers memory tier;

        tiersCount.increment();
        tier.id = tiersCount.current();
        tier.name = name;
        
        _tiers[tiersCount.current()] = tier;
        return tier;
    }

    function addReward(uint256 tier, address playerAddress, int64 amount) public onlyOwner override returns (Reward memory) {
        Reward memory reward;

        rewardsCount.increment();
        reward.id = rewardsCount.current();
        reward.playerAddress = playerAddress;
        reward.claimed = false;
        reward.claimable = true;
        reward.tier = _tiers[tier].name;
        reward.amount = amount;
        reward.timestamp = block.timestamp;
        _rewards[rewardsCount.current()] = reward;
        return reward;
    }

    function updatePlayer(address playerAddress, string memory username, string memory email, string memory twitter, string memory discord, string memory telegram) external returns(Player memory){
        _players[playerAddress].username = username;
        _players[playerAddress].email = email;
        _players[playerAddress].twitter = twitter;
        _players[playerAddress].discord = discord;
        _players[playerAddress].telegram = telegram;

        return _players[playerAddress];
    }

    function burnTokenPublic(address token, int64 amount, int64[] memory serialNumbers) external returns (int256 responseCode, int64 newTotalSupply) {
        (responseCode, newTotalSupply) = HederaTokenService.burnToken(token, amount, serialNumbers);
        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert ();
        }
    }


    function claimReward(uint256 _id, bytes[] memory metadata, string memory _tokenURI) public isTokensGenerated override returns (Reward memory) {
        require(_rewards[_id].claimed == false, "Reward already claimed");
        require(_rewards[_id].claimable == true, "Reward has been Revoked");

        address playerAddress = msg.sender;

        int64 amount = _rewards[_id].amount;

        _nfts[playerAddress].balance += amount;

        mintBlackPass(metadata, playerAddress, _tokenURI, _nfts[playerAddress].balance);
        _rewards[_id].claimed = true;
        return _rewards[_id];

    }

    function toggleClaimableStatus(uint256 _id, bool claimable) public onlyOwner override returns (Reward memory) {
        _rewards[_id].claimable = claimable;
        return _rewards[_id];
    }

    function updateRewardAmount(uint256 _id, int64 amount) public onlyOwner returns (Reward memory) {
        _rewards[_id].amount = amount;
        return _rewards[_id];
    }

    function updateRewardTier(uint256 _id, uint256 tier) public onlyOwner returns (Reward memory) {
        _rewards[_id].tier = _tiers[tier].name;
        return _rewards[_id];
    }

    function createBlackPassCollection(
        string memory name,
        string memory symbol,
        string memory memo,
        int64 maxSupply
    ) public onlyOwner payable {
        require(!blackPassCollectionGenerated, "Black Pass collection already generated");
        address treasury = address(this);
        IHederaTokenService.TokenKey[] memory keys = new IHederaTokenService.TokenKey[](5);
        keys[0] = getSingleKey(KeyType.ADMIN, KeyType.PAUSE, KeyValueType.INHERIT_ACCOUNT_KEY, bytes(""));
        keys[1] = getSingleKey(KeyType.KYC, KeyValueType.INHERIT_ACCOUNT_KEY, bytes(""));
        keys[2] = getSingleKey(KeyType.FREEZE, KeyValueType.INHERIT_ACCOUNT_KEY, bytes(""));
        keys[3] = getSingleKey(KeyType.SUPPLY, KeyValueType.INHERIT_ACCOUNT_KEY, bytes(""));
        keys[4] = getSingleKey(KeyType.WIPE, KeyValueType.INHERIT_ACCOUNT_KEY, bytes(""));


        IHederaTokenService.Expiry memory expiry = IHederaTokenService.Expiry(
            0, treasury, 8000000
        );

        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.memo = memo;
        token.treasury = treasury;
        token.tokenSupplyType = true;
        token.tokenKeys = keys;
        token.maxSupply = maxSupply;
        token.freezeDefault = false;
        token.expiry = expiry;

 
       (int responseCode, address createdToken) = HederaTokenService.createNonFungibleToken(token);
 
       if(responseCode != HederaResponseCodes.SUCCESS){
           revert("Failed to create non-fungible token");
       }
        blackPassCollection = createdToken;
        blackPassCollectionGenerated = true;

    }


    function ReedemBlackpass(bytes[] memory metadata, string memory _tokenURI) public isTokensGenerated override returns(int64){
        address playerAddress = msg.sender;
        require(_players[playerAddress].reedemed == false, "Player already reedemed");

        NFT memory nft;

        nftsCount.increment();
        nft.id = nftsCount.current();

        nft.idOfPlayer = _players[playerAddress].id;
        nft.collectionAddress = blackPassCollection;

        HederaTokenService.grantTokenKyc(blackPassCollection, playerAddress);

        int64 totalSupply = mintBlackPass(metadata, playerAddress, _tokenURI, 0);

        return totalSupply;
    }

    function mintBlackPass(bytes[] memory metadata, address playerAddress, string memory _tokenURI, int64 balance) public override returns(int64){
         (
            int256 response,
            int64 newTotalSupply,
            int64[] memory serialNumbers
        ) = HederaTokenService.mintToken(blackPassCollection, 0, metadata);

        if(response != HederaResponseCodes.SUCCESS){
            revert("Failed to mint non-fungible token");
        }


        int responseCode = HederaTokenService.transferNFT(blackPassCollection, address(this), playerAddress, serialNumbers[0]);

        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert ("Unable to Transfer NFT");
        }


        _nfts[playerAddress].serialId = serialNumbers[0];
        _nfts[playerAddress].tokenURI = _tokenURI;
        _nfts[playerAddress].balance = balance;
        _players[playerAddress].reedemed = true;

        return newTotalSupply;
    }


}