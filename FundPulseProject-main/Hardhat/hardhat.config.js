require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",  // or your contract's version
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
