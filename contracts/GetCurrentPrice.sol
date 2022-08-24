// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;
    int price;
    /*
    *Function to get current price of particular token 
    */

    function getPrice() external returns(int) {
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e); //this oracle address can be switched to enother oracle depending on network and token
        (,price,,,) = priceFeed.latestRoundData();
        return price;
    }
}
