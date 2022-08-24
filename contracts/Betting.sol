//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IToken {
    function mint(address _to, uint amount) external;
}

interface IPriceConsumerV3 {
    function getPrice() external returns(int);
}

contract Betting {
    address public oracleAddress;
    address public tokenAddress;
    address public ourMintableToken;
    address public factoryAddress;

    constructor(address _oracleAddress, address _tokenAddress, address _ourMintableToken) {
        oracleAddress = _oracleAddress;
        tokenAddress = _tokenAddress;
        factoryAddress = msg.sender;
        ourMintableToken = _ourMintableToken;
    }

    struct Bid {
        uint amount;
        bool priceWillUp;
        uint expirationTime;
        uint currentPrice;
        string asset1;
        string asset2;
    } 

    mapping (address => Bid) public activeBids;

    function getCurrentPrice() public returns(uint) {
        IPriceConsumerV3 _price = IPriceConsumerV3(oracleAddress);
        uint _currentPrice = uint(_price.getPrice());
        return (_currentPrice);
    }

    function placeABid(uint _tokenAmount, bool _forecast, uint _duration, string memory _asset1, string memory _asset2) external payable {
        require(activeBids[msg.sender].expirationTime == 0, "Bid already created!");
        require(_duration > 0, "Duration should be more then 0!");

        uint currentPrice = getCurrentPrice();

        Bid memory newBid = Bid(
            _tokenAmount,
            _forecast,
            block.timestamp + _duration,
            currentPrice,
            _asset1,
            _asset2
        );

        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _tokenAmount); // should be preliminary approved
        activeBids[msg.sender] = newBid;
    }

    function claimTheReward() external payable {
        address bidder = msg.sender;
        Bid memory bid = activeBids[bidder];

        require(bid.amount > 0, "You can hold only a single transaction!");
        require(bid.expirationTime <= block.timestamp, "Time haven't expired!");
        
        uint newCurrentPrice = getCurrentPrice();

        if  (
            bid.priceWillUp && newCurrentPrice > bid.currentPrice ||
                !bid.priceWillUp && newCurrentPrice < bid.currentPrice
            )
            {  
                uint _amount = bid.amount;
                IERC20 token = IERC20(tokenAddress);
                token.transfer(bidder, _amount); // return the deposeted funds, should work pirfect 
                delete bid; 

                IToken tokenAward = IToken(ourMintableToken);
                tokenAward.mint(bidder, _amount); // send a bidder equivalent amount of mintable tokens in case of correct prediction 
            } else {
                        delete bid;
                   }
    }
} 
