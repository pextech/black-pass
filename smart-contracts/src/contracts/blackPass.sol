// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./HederaTokenService.sol";
import { ICollection } from "./Interfaces/ICollection.sol";
import { IPlayer } from "./Interfaces/IPlayer.sol";
import { INFT } from "./Interfaces/INfts.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract blackPass is ICollection, IPlayer, INFT, ReentrancyGuard, Ownable, HederaTokenService {

    using Counters for Counters.Counter;

    Counters.Counter public collectionCount;
    Counters.Counter public nftsCount;
    Counters.Counter public playersCount;


    mapping (uint256 => Collection) public _collections;
    mapping (uint256 => Player) public _players;
    mapping (uint256 => NFT) public _nfts;

    address public defaultAdmin;


    constructor(){
        defaultAdmin = owner();
    }

    modifier onlyDefaultCaller(){
        require(msg.sender == defaultAdmin, "Only defaultAdmin can call this");
        _;
    }

    function tokenAssociate(address sender, address tokenAddress) external {
        int response = HederaTokenService.associateToken(sender, tokenAddress);

        if (response != HederaResponseCodes.SUCCESS) {
            revert ("Associate Failed");
        }
    }

    function setPlayer(string memory _name, address playerAddress) public onlyDefaultCaller override returns (Player memory) {
        Player memory player;

        playersCount.increment();
        player.id = playersCount.current();
        player.name = _name;
        player.playerAddress = playerAddress;
        player.active = true;
        player.claimed = false;
        _players[playersCount.current()] = player;
        return player;
    }

    function updatePlayer(uint256 _id, string memory _name, address playerAddress, bool status, bool claimed) public onlyDefaultCaller override returns(Player memory){
        require(playersCount.current() >= _id, "No Player Found");
            _players[_id].name = _name;
            _players[_id].playerAddress = playerAddress;
            _players[_id].active = status;
            _players[_id].claimed = claimed;
            
        return _players[_id];
    }

    function allPlayers() public view override returns (Player[] memory){
        uint256 playerIndex = 0;

        Player[] memory PlayerArray = new Player[](playersCount.current());

        for (uint256 i = 0; i < playersCount.current(); i++) {
                uint256 currentPlayerId = i + 1;
                Player storage currentPlayer = _players[currentPlayerId];
                PlayerArray[playerIndex] = currentPlayer;
                playerIndex += 1;
        }
        return PlayerArray;
    }

    function allCollections() public view override returns (Collection[] memory){
        uint256 collectionIndex = 0;

        Collection[] memory CollectionArray = new Collection[](collectionCount.current());

        for (uint256 i = 0; i < collectionCount.current(); i++) {
                uint256 currentCollectionId = i + 1;
                Collection storage currentCollection = _collections[currentCollectionId];
                CollectionArray[collectionIndex] = currentCollection;
                collectionIndex += 1;
        }
        return CollectionArray;
    }

    function setCollection(string memory _name, string memory _symbol, uint256 playerId, address collectionAddress) public onlyDefaultCaller override returns (Collection memory) {
        require(playersCount.current() >= playerId, "No Player Found");
        require(_players[playerId].active == true, "not authorized");
        require(_players[playerId].claimed == false, "Player already claimed");

        Collection memory collection;

        collectionCount.increment();
        collection.id = collectionCount.current();
        collection.name = _name;
        collection.symbol = _symbol;
        collection.nfts = 0;
        collection.idOfPlayer = playerId;
        collection.collectionOwner = _players[playerId].playerAddress;
        collection.collectionAddress = collectionAddress;
        _collections[collectionCount.current()] = collection;

        return collection;
    }


    function whitelist_as_Default_Admin(address target) onlyOwner public {
        defaultAdmin = target;
    }


  function mint(uint256 collectionId, bytes[] memory metadata, string memory _tokenURI) public onlyDefaultCaller override returns(uint){
        require(collectionCount.current() >= collectionId, "No Collection Found");
        NFT memory nft;

        nftsCount.increment();
        nft.id = nftsCount.current();

        nft.idOfPlayer = _collections[collectionId].idOfPlayer;
        nft.idOfCollection = collectionId;
        nft.tokenURI = _tokenURI;
        nft.collectionAddress = _collections[collectionId].collectionAddress;


         (
            int256 response,
            uint64 newTotalSupply,
            int64[] memory serialNumbers
        ) = HederaTokenService.mintToken(_collections[collectionId].collectionAddress, 0, metadata);

        if(response != HederaResponseCodes.SUCCESS){
            revert("Failed to mint non-fungible token");
        }

        nft.tokenId = serialNumbers[0];
        _nfts[nftsCount.current()] = nft;

        _collections[collectionId].nfts += 1;

        return nftsCount.current();

    }
}