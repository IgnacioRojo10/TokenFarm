//this file is how we actually connect our project to the blockchain

require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, //changed this from 7545 to 8545, to match the port of ganache
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/', //normally the contracts are inside migrations, however we are putting them in the source, and
  //when we compile it ill go inside src as well. This is because we are creating a react and it need to have access to it
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
