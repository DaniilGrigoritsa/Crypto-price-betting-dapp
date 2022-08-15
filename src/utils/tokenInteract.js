import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
await window.ethereum.enable();

const ERC20TokenABI = require("../abi/tokenABI.json");

export const approveTokenTransaction = (tokenToInvest, from, to, amount) => {
    const ERC20TokenContract = new web3.eth.Contract(ERC20TokenABI, tokenToInvest);

    ERC20TokenContract.methods.approve(to, amount).send({
        from: from
    }, function (err, res) {
        if (err) {
            console.log("An error occured", err);
            return
        }
        console.log("Hash of the transaction: " + res)
    })
}

export const tokenBalance = (tokenToInvest, from) => {
    const ERC20TokenContract = new web3.eth.Contract(ERC20TokenABI, tokenToInvest);

    ERC20TokenContract.methods.balanceOf(from).send({
        from: from
    }, function (err, res) {
        if (err) {
            console.log("An error occured", err);
            return
        }
        return res;
    })
}