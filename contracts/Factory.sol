//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;
import "./Betting.sol";

/*
*The purpose of this smart contract is to create an instance of new Betting.sol smart contracts 
*in order to allow users to utilize new tokens to make their bids (this warks like a pool factory of uniswap pairs)
*/
contract Factory {
    address public oracleAddress;
    address public ourMintableToken;

    constructor(address  _oracleAddress, address _ourMintableToken){
        oracleAddress = _oracleAddress;
        ourMintableToken = _ourMintableToken;
    }

    mapping(address => address) public bettingPools; // token address => contract pool address 

    function createPool(address _tokenAddress) public returns (address) {
        require(_tokenAddress != address(0), "invalid token address");
        require(bettingPools[_tokenAddress] == address(0), "exchange already exists");

        Betting bet = new Betting(oracleAddress, _tokenAddress, ourMintableToken);
        bettingPools[_tokenAddress] = address(bet);

        return address(bet);
    }

    function getPoolAddress(address _tokenAddress) public view returns (address) {
        return bettingPools[_tokenAddress];
    }
}
