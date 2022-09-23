import React, { Component } from 'react'
import Web3 from "web3"
import DaiToken from "../abis/DaiToken.json"
import DappToken from "../abis/DappToken.json"
import TokenFarm from "../abis/TokenFarm.json"
import Navbar from './Navbar'
import './App.css'
import Main from './Main.js'

class App extends Component {

  async componentWillMount() { //2. here we are calling the down function
    await this.loadWeb3()
    await this.loadBlockchainData() //3. we wrote this line after seeing that everything was alright
  }

async loadBlockchainData() { //4. loading blockchain data into the app
  const web3 = window.web3

  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0]}) //5. we are setting the state to be the first account in the blockchain

  const networkId = await web3.eth.net.getId() //8. line to get the network id, where the contract is deployed
  console.log(networkId)

  //load DaiToken, we need to things to write the smart contract into JS, the ABI and the address
  const daiTokenData = DaiToken.networks[networkId] //9. we imported DaiToken (daitoken.json)
  if(daiTokenData) {
    const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address) //creating the new contract in JS
    this.setState({ daiToken }) //adding it to the state of REACT
    let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call() //the line is just web3 shit (why methods and call, you have to use call whenever you are reading info)
    this.setState({daiTokenBalance: daiTokenBalance.toString()})
  } else {
    window.alert("DaiToken contract not deployed to detected network.")
  }
 //load Dapp Token, the same as DaiToken
  const dappTokenData = DappToken.networks[networkId]
  if(dappTokenData) {
    const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address) 
    this.setState({ dappToken }) 
    let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call() 
    this.setState({dappTokenBalance: dappTokenBalance.toString()})
  } else {
    window.alert("DappToken contract not deployed to detected network.")
  }

  //load FarmToken, the same as DaiToken
  const tokenFarmData = TokenFarm.networks[networkId]
  if(tokenFarmData) {
    const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address) 
    this.setState({ tokenFarm }) 
    let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call() 
    this.setState({stakingBalance: stakingBalance.toString()})
  } else {
    window.alert("DappToken contract not deployed to detected network.")
  }
}

  async loadWeb3() {  //1. this function connects the app to the blockchain. just instructions from metamask to connect it. this functions is defined but not called yet
    if(window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
      else {
        window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
    }

    this.setState({ loading: false }) //10. once all the data is fetched, then the loading is done, so its false 
  }

    stakeTokens = (amount) => { //**** this is the defined function, NO fucking idea whats this
      this.setState({ loading: true})
      this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on("transactionHash", (hash) => {
        this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account}).on("transactionHash", (hash) => {
          this.setState({loading: false})
        })
      })
    }

    unstakeTokens = (amount) => { //**** this is the defined function, NO fucking idea whats this
      this.setState({ loading: true})
        this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account}).on("transactionHash", (hash) => {
          this.setState({loading: false})
        })
    }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',//6. we added all the code below as well, to the state object
      daiToken: {}, //7. the dai dapp and token part are to save the contracts in the state
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: "0",
      dappTokenBalance: "0",
      stakingBalance: "0",
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center"> Loading...</p> //11. if its still fetching info from Blockchain then loading
    } else {
      content = <Main//12. if not, then it will be the main page, and then it will be in {content}, curly braces to read code in html
      daiTokenBalance = {this.state.daiTokenBalance} //13. we added the balances to the content, so they can be rendered as well
      dappTokenBalance = {this.state.dappTokenBalance}
      stakingBalance = {this.state.stakingBalance}
      stakeTokens = {this.stakeTokens}
      unstakeTokens = {this.unstakeTokens} /> /**** we wrote this line to we can use the staketokens inside the render */ 
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content} 

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
