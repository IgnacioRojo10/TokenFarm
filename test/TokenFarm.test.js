const { assert } = require("chai");
const _deploy_contracts = require("../migrations/2_deploy_contracts");

const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

require("chai")//all these is to use chai and shit
    .use(require("chai-as-promised"))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) =>{ //write test inside here
    let daiToken, dappToken, tokenFarm

    before(async () => { //this is simulating the migration
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        await dappToken.transfer(tokenFarm.address, tokens('1000000')) //transfering all tokens to token farm

        await daiToken.transfer(investor, tokens('100'), {from: owner}) //in the test we are being explicit for who transfer it

    })

    describe("Mock DAI deployment", async() => { //I dont undersatnd this shit
        it("has a name", async() => {
            //let daiToken = await DaiToken.new()// this line so we can store the DappToken contract. I commented let line bc is not necessary, we stablished it in the before function
            const name = await daiToken.name()// this line to extract the name from the DappToken contract
            assert.equal(name, "Mock DAI Token")

        })
    })

    describe("Dapp Token deployment", async() => { //I dont undersatnd this shit
        it("has a name", async() => {
            // let dappToken = await DappToken.new() // this line so we can store the DappToken contract
            const name = await dappToken.name() // this line to extract the name from the DappToken contract
            assert.equal(name, "Dapp Token")

        })
    })

    describe("Token Farm deployment", async() => { //I dont undersatnd this shit
        it("has a name", async() => {
            // let tokenFarm = await TokenFarm.new() // this line so we can store the DappToken contract
            const name = await tokenFarm.name() // this line to extract the name from the DappToken contract
            assert.equal(name, "Dapp Token Farm")
        })
        it("Contract has tokens", async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address) //we are checking if TokenFarm contract has the balance **we check that through the dappToken contract NOT the tokenfarm one
            assert.equal(balance.toString(), tokens('1000000'))

        })
    })

    describe("Farming tokens", async() => {
        it("rewards investors for staking mDai tokens", async() => {
            let result 

            result = await daiToken.balanceOf(investor) //check investor balance before staking
            assert.equal(result.toString(), tokens("100"), "investor Mock DAI wallet balance correct before staking")

            await daiToken.approve(tokenFarm.address, tokens("100"), {from: investor})//line down this one written frst. this allow tokenfarm to spend 100 daitokens
            await tokenFarm.stakeTokens(tokens("100"), {from: investor})//this test alone will fail, as it need to be approved by the dai contract

            result = await daiToken.balanceOf(investor) //check investor balance after staking, they should have 0, as its all staked
            assert.equal(result.toString(), tokens("0"), "investor Mock DAI  wallet balance correct before staking")

            result = await daiToken.balanceOf(tokenFarm.address) //check tokenFarm balance of daitoken (they should have 100)
            assert.equal(result.toString(), tokens("100"), "investor Mock DAI wallet balance correct before staking")

            result = await tokenFarm.stakingBalance(investor) //investor staking balance should be 100
            assert.equal(result.toString(), tokens("100"), "investor Mock DAI wallet balance correct before staking")

            result = await tokenFarm.isStaking(investor) //check if isStaking status of investor is true
            assert.equal(result.toString(), "true", "investor Mock DAI wallet balance correct before staking")
            
            //issuing tokens test

            await tokenFarm.issueToken({from: owner}) //calling issue token function

            result = await dappToken.balanceOf(investor) //checking the investor has 100 DAPP as he staked 100 DAI
            assert.equal(result.toString(), tokens("100"), "investor Dapp token wallet balance correct after issuance")

            await tokenFarm.issueToken({from: investor}).should.be.rejected; //if investor try calling function, it should be rejected

            //unstake tokens test

            await tokenFarm.unstakeTokens({from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens("100"), "investor Dai wallet balance correct after unstaking" )

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens("0"), "TokenFarm Dai balance correct after unstaking")

            result = await tokenFarm.isStaking(investor) //check if isStaking status of investor is true
            assert.equal(result.toString(), "false", "investor Mock DAI wallet balance correct after unstaking")
        })
    }) 

    

})