import styles from "./App.css";
import { useState, useEffect } from 'react';
import { connectWallet, placeABid, claimTheReward} from './utils/interact.js';
import { getCurrencyPrice } from './utils/priceRequest';
import { createPool, getPoolAddress } from './utils/factory'; 
import { approveTokenTransaction, tokenBalance } from './utils/tokenInteract';
import { Modal } from "./utils/modal";
import { Chart } from "./utils/graph";


function App() {
  const [balance, setBalance] = useState(""); // chosen tokens user balance 
  const [address, setWallet] = useState(""); // address of connected metamask wallet 
  const [status, setStatus] = useState("Connect your metamask wallet 🦊");
   
  const [showConnectButton, setShowConnectButton] = useState(true);
  const [poolConnected, setPoolConnected] = useState(false);
   
  const [coin, setCoin] = useState("USDC"); // set name of coin, user want's to invest 
  const [currentPrice, setCurrentPrice] = useState(null); // current price of chosen crypto asset 
  const [poolAddress, setPoolAddress] = useState(""); // address of created pool of chosen token
  const [tokenToInvest, setTokenToInvest] = useState(""); // address of invested token
  const [amountToEnvest, setAmountToEnvest] = useState(); // user paste an amount of tokens to envest
  const [cryptoAsset, setCryptoAsset] = useState(""); // name of crypto asset, which price is going to be tracked 
  const [modalActive, setModalActive] = useState(false);  // popup if error ocures   
  const [popupReason, setPopupReason] = useState(); // the mesage, that user will see in popup 
  const [decision, setDecision] = useState(null); // False - if user suppose, that price of chosen crypto asset will go down, True - otherwise
  const [duration, setDuration] = useState(); // duration of user's bed, after expiration he may claim the raward 

  
  useEffect(() => {
    const fetchData = async () =>  {
      const _price = await getCurrencyPrice(cryptoAsset);
      setCurrentPrice(_price);
    }
    setInterval(() => {fetchData()}, 2000);
    console.log(cryptoAsset);
  }, [cryptoAsset]);


  const tokenAddresses = {
    // addresses from chainlink rinkebi testnet, switch to mainnet later
    // we will bid with this tokens
    "USDC": "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
    "Matic": "0x7794ee502922e2b723432DDD852B3C30A911F021",
    "DAI": "0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF"
  }

  const handlePoolConnection = async () => {
    const addr = await getPoolAddress(tokenToInvest);
    if (addr === "0x0000000000000000000000000000000000000000") {
      const _addr = await createPool(tokenToInvest, address);
      console.log(_addr);
      setPoolAddress(_addr);
      setPoolConnected(true);
    } else {
      console.log(addr);
      setPoolAddress(addr);
      setPoolConnected(true);
    }
  }


  const handlePlacingABid = async () => {
    const _balance = tokenBalance(tokenToInvest, address); 
    setBalance(_balance);

    if (decision === null) {
      setModalActive(true); 
      setPopupReason("Please try predict the price fluctuation");
    } else if (duration === null) {
        setModalActive(true); 
        setPopupReason("Please set duration");
      } else if (amountToEnvest >= _balance || _balance <= 0) {
        setModalActive(true); 
        setPopupReason("Amount of beed exeedes your balance !");
      } else {
        approveTokenTransaction(tokenToInvest, address, poolAddress, amountToEnvest);
        placeABid(poolAddress, address, amountToEnvest, decision, duration);
      }
  }


  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    setShowConnectButton(false);
  }

  /**
   * 
   * @dev handle metamask wallet connection 
   */

  const ConnectWalletButton = () => (
    <div>
      <button className={styles.button} onClick={() => connectWalletPressed()}>Connect wallet</button>
    </div>
  )


  const ListOfCryptoAssets = () => {
    return (
      <div className="select">
        <select value={cryptoAsset} onChange={(event) => {
              setCryptoAsset(event.target.value);

            }
          }>
			    <option>BTC</option>
          <option>ETH</option>
		    </select>
      </div>
    );
  }

  const PasteAmountToEnvest = () => {
    return (
      <div>
        <input
        type="number"
        placeholder="Enter amount"
        onChange={(e) => setAmountToEnvest(e.target.value)}
        value={amountToEnvest}
        />
      </div>
    )
  }


  const PasteDuration = () => {
    return (
      <div>
        <input
        type="number"
        placeholder="Enter duration"
        onChange={(e) => setDuration(e.target.value)}
        value={duration}
        />
      </div>
    )
  }


  const PoolConnection = () => {
    return (
      <div>
        <div>
          <button onClick = {() => handlePoolConnection()}>Choose token</button>
        </div>
        <div>
          <select value={coin} onChange={(event) => {
                setCoin(event.target.value);
                setTokenToInvest(tokenAddresses[event.target.value]);
              }
            }>
			      <option>USDC</option>
            <option>Matic</option>
			      <option>DAI</option>
		      </select>
        </div>
      </div>
    )
  }


  const PoolInteraction = () => {
    return (
      <div>
        <div>
          <button onClick = {() => handlePlacingABid()}>Place a bid</button> 
        </div>
        <div>
          <PasteAmountToEnvest />
          <PasteDuration />
        </div>
        <div>
          <button onClick = {poolConnected ? () => claimTheReward(poolAddress, address) : null}>Claim the reward</button>
        </div>
        <div>
          <button className='green' onClick = {() => setTimeout(() =>setDecision(true), 0)}>Up</button>
          <button className='rad' onClick = {() => setTimeout(() =>setDecision(false), 0)}>Down</button>
        </div>
        <div>
          <ListOfCryptoAssets />
        </div>
        <p>Current {cryptoAsset} price: {currentPrice}$</p>
	    </div>
    )
  }


	return (
    <div>
      <div id={cryptoAsset !== "" ? "container" :  null}>
        {cryptoAsset !== "" ?  <Chart coin={cryptoAsset} /> : null}
      </div>
      <div id="container" className="App">
        <div>
          <p className="wrapper">{status}</p>
          <div>
            { showConnectButton ? <ConnectWalletButton /> : null }
          </div>
        </div>
        <div>
          { poolConnected ? < PoolInteraction /> : <PoolConnection /> }
        </div>
        <Modal active={modalActive} setActive={setModalActive} reason={popupReason}/>
	    </div>
    </div>
  );
}

export default App;
