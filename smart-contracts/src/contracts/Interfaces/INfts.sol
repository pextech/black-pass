// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

interface INFT {

  struct NFT {
    uint256 id;
    uint256 idOfCollection;
    uint256 idOfPlayer;
    int64 tokenId;
    address collectionAddress;
    string tokenURI;
  }

  function mint(uint256 collectionId,bytes[] memory metadata , string memory _tokenURI) external returns(uint);


}