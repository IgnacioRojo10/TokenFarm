const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");


module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(DaiToken) //deployed dai token
    const daiToken = await DaiToken.deployed() //saved it to a variable

    await deployer.deploy(DappToken) //deployed dapp token
    const dappToken = await DappToken.deployed()//saved it to a variable

    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address) //deployed token farm , with the addresses of each token (same as the contractr function in tokenfarm contract)
    const tokenFarm = await TokenFarm.deployed() 

    await dappToken.transfer(tokenFarm.address, '1000000000000000000000000') //we transfered the total amount of the DappToken to the TokenFArm

    await daiToken.transfer(accounts[1], '100000000000000000000') //transfer 100 DAPP to an investor (account number 1 in ganache)
};
 