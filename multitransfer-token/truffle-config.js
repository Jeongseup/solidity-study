// require('babel-register')
// require('babel-polyfill')
require('dotenv').config()
// const HDWalletProvider = require('truffle-hdwallet-provider-privkey')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { PRIVATE_KEY, ENDPOINT_URL } = process.env

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1', // Localhost (default: none)
            port: 7545, // Standard Ethereum port (default: none)
            network_id: '5777' // Any network (default: none)
        },
        ropsten: {
            provider: () => {
                return new HDWalletProvider(PRIVATE_KEY, ENDPOINT_URL)
            },
            network_id: 3 // Ropsten's id
            // gas: 5500000, // Ropsten has a lower block limit than mainnet
            // onfirmations: 2, // # of confs to wait between deployments. (default: 0)
            // timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
            // skipDryRun: true // Skip dry run before migrations? (default: false for public nets )
        }
    },
    // contracts_directory: './contracts/',
    // contracts_build_directory: './build/contracts',
    compilers: {
        solc: {
            version: '0.8.12' // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            // settings: {          // See the solidity docs for advice about optimization and evmVersion
            //  optimizer: {
            //    enabled: false,
            //    runs: 200
            //  },
            //  evmVersion: "byzantium"
            // }
        }
    }
}
