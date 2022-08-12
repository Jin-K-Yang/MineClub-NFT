const hre = require("hardhat");

async function main() {
  const baseURI = "ipfs://test/";

  // We get the contract to deploy
  const MineClub = await hre.ethers.getContractFactory("MineClub");
  const mineclub = await MineClub.deploy();

  await mineclub.deployed();
  console.log("MineClub deployed to:", mineclub.address);

  await mineclub.setValidTypeId(0, true);
  console.log("Valid Type Id 0:", await mineclub.valid(0));

  await mineclub.setBaseURI(baseURI);
  console.log("Base URI:", await mineclub.uri(0));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
