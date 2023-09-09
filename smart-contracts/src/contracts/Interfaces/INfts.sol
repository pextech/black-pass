// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

interface INFT {

  struct NFT {
    uint256 id;
    uint256 idOfCollection;
    uint256 idOfPlayer;
    int64 serialId;
    address collectionAddress;
    string tokenURI;
    int64 balance;
  }

  function ReedemBlackpass(bytes[] memory metadata , string memory _tokenURI) external returns(int64);
  function mintBlackPass(bytes[] memory metadata, address playerAddress, string memory _tokenURI, int64 balance) external returns(int64);

}