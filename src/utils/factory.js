import Web3 from 'web3';
const web3 = new Web3(window.ethereum);
await window.ethereum.enable();

const factoryABI = require("../abi/factory.json");
const factoryAddress = process.env.REACT_APP_FACTORY_ADDRESS; 
//const factoryAddress = "0x54169bc6B0ace87De8436099Eae3C75B16627d31"
const factory = new web3.eth.Contract(factoryABI, factoryAddress);

export const createPool = async (tokenAddress, account) => {
    await factory.methods.createPool(tokenAddress).send({ from: account });
    const res = await factory.methods.getPoolAddress(tokenAddress).call();
    return res;
}

export const getPoolAddress = async (tokenAddress) => {
    console.log(factoryAddress);
    console.log(factory);
    const poolAddress = await factory.methods.getPoolAddress(tokenAddress).call();
    return poolAddress;
}