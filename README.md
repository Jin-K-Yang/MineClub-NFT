# MineClub-NFT
An ERC1155 NFT contract

# Test
```
npx hardhat coverage
```
![](https://i.imgur.com/oYsYxxy.jpg)

# Test in hardhat local network
```
npx hardhat run --network hardhat scripts/deploy.js
```
or
```
npx hardhat node
npx hardhat run --network localhost scripts/my-script.js
```
Above command let external clients can connect to it like MetaMask, your Dapp front-end or a script.

# Deploy
```
npx hardhat run --network goerli scripts/deploy.js
``` 

# Verify on Etherscan
```
npx hardhat verify --network goerli CONTRACT_ADDRESS
```
