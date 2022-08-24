// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
This token contract is created to pay winners their rewards 
for corrrect price change prediction proportionally to their 
bidded amount equevalent in stablecoins (e.g. 1 reward token
 = 1 usdt value of token bidded by uesr)
*/

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    /*
    *This function is used to mint reward tokens to winner address  
    */

    function mint(address _to, uint amount) external {
        _mint(_to, amount);
    }
}
