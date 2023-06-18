// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

interface ICollection {

    struct Collection {
        uint256 id;
        address collectionOwner;
        address collectionAddress;
        uint256 idOfPlayer;
        string name;
        string symbol;
        uint256 nfts;
    }

    function allCollections() external view returns (Collection[] memory);
    function setCollection(string memory _name, string memory _symbol, uint256 adminId, address collectionAddress) external returns (Collection memory);


}