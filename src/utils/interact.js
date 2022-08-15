import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
await window.ethereum.enable(); 

const contractABI = require("../abi/contract.json");


export const placeABid = async (poolAddress, from, amount, decision, duration) => {
  const contract = new web3.eth.Contract(contractABI, poolAddress);

  const data = contract.methods.placeABid(amount, decision, duration, "", "").encodeABI();
  const nonce = await web3.eth.getTransactionCount(from, 'latest');

  const transaction = {
      'from': from,
      'to': poolAddress,
      'value': "0x00",
      'gasLimit': "6800000", 
      'gasPrice': "21000",  
      'nonce': nonce.toString(),
      'data': data
  };
  //const estimatedGas = web3.eth.estimateGas(transaction);   // gas estimation error in metamask 
  //transaction.gas = estimatedGas;

  await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [transaction],
  }).then((result) => {console.log(result)}).catch((error) => {console.log(error)}); 
}


export const claimTheReward = async (poolAddress, from) => {
  const contract = new web3.eth.Contract(contractABI, poolAddress);

  const data = contract.methods.claimTheReward().encodeABI();
  const nonce = await web3.eth.getTransactionCount(from, 'latest');

  const transaction = {
      'from': from,
      'to': poolAddress,
      'value': "0x00",
      'gasLimit': "6800000", 
      'gasPrice': "21000",  
      'nonce': nonce.toString(),
      'data': data
  };

  await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [transaction],
  }).then((result) => {console.log(result)}).catch((error) => {console.log(error)}); 
}


export const connectWallet = async () => {
  let err;

  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        address: addressArray[0],
        status: "Wallet connected: " + String(addressArray[0]).substring(0, 5) + "..." + String(addressArray[0]).substring(38),
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "😥 " + err.message,
    };
  }
}
