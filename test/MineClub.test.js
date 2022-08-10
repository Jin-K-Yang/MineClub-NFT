const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MineClub", function () {
  let MineClub, mineclub, owner, addr1;
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    MineClub = await ethers.getContractFactory("MineClub");
    mineclub = await MineClub.deploy();
    await mineclub.deployed();
  })

  describe("Deployment constructor", function () {
    it("Should set the right owner", async function () {
      expect(await mineclub.owner()).to.equal(owner.address);
    })
  })

  describe("Valid Type Id", function () {
    it("Should set the valid type id", async function () {
      await mineclub.setValidTypeId(0, true);

      expect(await mineclub.valid(0)).to.equal(true);
      expect(await mineclub.valid(1)).to.equal(false);
    })

    it("Should be reverted because of the caller is not owner", async function () {
      await expect(mineclub.connect(addr1).setValidTypeId(1, true)).to.be.revertedWith("Ownable: caller is not the owner");
    })
  })

  describe("Base URI", function () {
    const baseURI = "ipfs://test/";

    it("Should set the base URI", async function () {
      await mineclub.setValidTypeId(0, true);
      await mineclub.setBaseURI(baseURI);

      expect(await mineclub.uri(0)).to.equal(baseURI + "0");
    })

    it("Should be reverted because the caller is not owner", async function () {
      await expect(mineclub.connect(addr1).setBaseURI(baseURI)).to.be.revertedWith("Ownable: caller is not the owner");
    })

    it("Should be reverted because id is not valid", async function () {
      await expect(mineclub.uri(1)).to.be.revertedWith("Valid: Not valid id");
    })
  })

  describe("Mint", function () {
    it("Should mint VIP pass", async function () {
      await mineclub.setValidTypeId(0, true);
      await mineclub.mint(0, 1, { value: ethers.utils.parseEther("1.0") });

      expect(await mineclub.balanceOf(owner.address, 0)).to.equal(1);
      expect(await mineclub.totalSupply(0)).to.equal(1);
    });

    it("Should be reverted because id is not valid", async function () {
      await expect(mineclub.mint(0, 1, { value: ethers.utils.parseEther("1.0") })).to.be.revertedWith("Valid: Not valid id");
    })

    it("Should be reverted because of the incorrect payment", async function () {
      await mineclub.setValidTypeId(0, true);
      await expect(mineclub.mint(0, 2, { value: ethers.utils.parseEther("1.1") })).to.be.revertedWith("Purchase: Incorrect payment");
    });

    it("Should be reverted because of the limitation of per transaction", async function () {
      await mineclub.setValidTypeId(0, true);
      await expect(mineclub.mint(0, 3, { value: ethers.utils.parseEther("3.0") })).to.be.revertedWith("Purchase: Exceed the limitation of per transaction");
    })

    // It will take 40 seconds to test so I comment it
    it("Should be reverted because the limmitation of total supply", async function () {
      await mineclub.setValidTypeId(0, true);
      for (let i = 0; i < 2500; i++) {
        await mineclub.mint(0, 2, { value: ethers.utils.parseEther("2.0") })
      }

      await expect(mineclub.mint(0, 1, { value: ethers.utils.parseEther("1.0") })).to.be.revertedWith("Purchase: Max total supply exceeded");
    })
  })

  describe("Withdraw", function () {
    it("Should withdraw fund by the owner", async function () {
      await mineclub.setValidTypeId(0, true);
      await mineclub.mint(0, 2, { value: ethers.utils.parseEther("2.0") });

      const ownerBalanceBeforeWithdraw = ethers.utils.formatEther(await mineclub.provider.getBalance(owner.address),);

      await mineclub.withdraw();

      const ownerBalanceAfterWithdraw = ethers.utils.formatEther(await mineclub.provider.getBalance(owner.address),);

      expect(parseInt(ownerBalanceAfterWithdraw) > parseInt(ownerBalanceBeforeWithdraw));
    })

    it("Should be reverted because the caller is not owner", async function () {
      await expect(mineclub.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
    })
  })
});
