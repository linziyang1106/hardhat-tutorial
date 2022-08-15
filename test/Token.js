const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("Token contract", function () {

    // 将部署合约的方法抽出来，执行一次，避免重复代码并提高测试套件的性能
    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory("Token");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const hardhatToken = await Token.deploy();

        await hardhatToken.deployed();

        // Fixtures can return anything you consider useful for your tests
        return { Token, hardhatToken, owner, addr1, addr2 };
    }


    it("Deployment should assign the total supply of tokens to the owner", async function () {
        // const [owner] = await ethers.getSigners();

        // const Token = await ethers.getContractFactory("Token");

        // const hardhatToken = await Token.deploy();

        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });

    // 转账测试
    it("在不同的account之间转账", async function () {
        // const [owner, addr1, addr2] = await ethers.getSigners();

        // const Token = await ethers.getContractFactory("Token");

        // const hardhatToken = await Token.deploy();

        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

        // Transfer 50 tokens from owner to addr1
        // 默认使用owner account调用合约的方法
        // await hardhatToken.transfer(addr1.address, 50);
        // expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

        // Transfer 50 tokens from addr1 to addr2
        // 使用connect()方法来切换调用合约的account
        // await hardhatToken.connect(addr1).transfer(addr2.address, 50);
        // expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);

        // Transfer 50 tokens from owner to addr1
        await expect(
            hardhatToken.transfer(addr1.address, 50)
        ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

        // Transfer 50 tokens from addr1 to addr2
        // We use .connect(signer) to send a transaction from another account
        await expect(
            hardhatToken.connect(addr1).transfer(addr2.address, 50)
        ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });
});