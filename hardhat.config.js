require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('solidity-coverage');
require('dotenv').config()
require("hardhat-gas-reporter");

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.4",
  mocha: {
    timeout: 100000,
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  },
  // verify contract
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    }
  },
};
