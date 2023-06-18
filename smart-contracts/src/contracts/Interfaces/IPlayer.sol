// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

interface IPlayer {

    struct Player {
        uint256 id;
        address playerAddress;
        string name;
        bool active;
        bool claimed;
    }

    function allPlayers() external view returns (Player[] memory);
    function setPlayer(string memory _name, address playerAddress) external returns (Player memory);
    function updatePlayer(uint256 _id, string memory _name, address playerAddress, bool status, bool claimed) external returns(Player memory);


}