pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {

    string public name = "Dapp Token Farm"; // State variable. Its going to be stored in the blockchain.
    DappToken public dappToken; // we had to write them here, so we can have access later to them
    DaiToken public daiToken;//otherwise it will be only stored in the constructor
    address public owner; // This is to have it stated but I dont understand why.

    address[] public stakers; //array to keep track of WHO has staked, why? to know who and then reward them with Dapp
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public { //gets called only once and when the contract it created. The arguments
    //that are inside are taking the address of each contract
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    } 

    //1. Stake Tokens (deposit)

    function stakeTokens(uint _amount) public { //public so the function can be called by some1 else outside this smart contract

        require(_amount >0, "ammount cannot be 0"); //they need to stake amounts over 0

        daiToken.transferFrom(msg.sender, address(this), _amount);//transfer dai to this contract

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount; //updating staking balance

        if(!hasStaked[msg.sender]) { //add user to staker array IF he hasnt staked already
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true; //updating staking status
        isStaking[msg.sender] = true; //updating staking status

    }

    //2. Issue Tokens (reward for staking)

    function issueToken() public { //only the owner of the app should be able to call this application, thereofre require is needed
        require(msg.sender == owner, "caller must be the owner");
        for(uint i=0; i<stakers.length; i++) {
            address  recipient = stakers[i];
            uint balance = stakingBalance[recipient]; //we are taking how many staked tokens this guy have
            if(balance > 0) { //only if they have tokens staked, therefore balance over 0
                dappToken.transfer(recipient, balance); //then we are sending this guy, the amount of tokens they have staked but dapp now (1 on 1)
            }
        }
    }

    function unstakeTokens() public {

        uint balance = stakingBalance[msg.sender]; // to know how much balance they have staked

        require(balance > 0, "staking balance should be higher than 0" ); //if not, they cannot retire eanything

        daiToken.transfer(msg.sender, balance); // transfering all the amount of the balance

        stakingBalance[msg.sender] = 0; //assuming he transfered everything

        isStaking[msg.sender] = false; //he is no longer staking
    }

}

 