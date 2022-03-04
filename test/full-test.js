const { expect } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");

const rewardDistribution = require('./rewardDistributionForTest.json');

function makeLeaf (index, address, amount) {
  return Buffer.from (ethers.utils.solidityKeccak256(["uint256", "address", "uint256"], [index, address, amount]).slice(2), "hex")
}

function makeLeaves (users) {
  return rewardDistribution.distribution.map(distribution => {
    let amount = BigNumber.from(distribution.amount.hex);
    amount = amount.toString();
    // amount = '' + 1000 * (distribution.index + 1);
    const address = users[distribution.index].address;
    return makeLeaf(distribution.index, address, amount);
  });
}

// Deploy and create a mock erc721 contract.
describe("Test Start", function () {
	let SimpleRewardDistributorFlat;
  let TestTokenWithNameAndSymbolFlat;

	let SimpleRewardDistributorFlatContract;
  let TestTokenWithNameAndSymbolFlatContract;

	let contractOwner;
	let users;

  let leaves;
  let root;
	let merkleTree;

	before(async function () {
    users = await ethers.getSigners();
    contractOwner = users[0];

    leaves = makeLeaves(users);

		merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true});
		const rootHash = merkleTree.getHexRoot();
    root = rootHash;

    const totalSupply = ethers.utils.parseEther("30000");

    TestTokenWithNameAndSymbolFlat = await ethers.getContractFactory("TestTokenWithNameAndSymbolFlat");
    TestTokenWithNameAndSymbolFlatContract = await TestTokenWithNameAndSymbolFlat.deploy("TestToken", "TK");
    await TestTokenWithNameAndSymbolFlatContract.deployed();

    await TestTokenWithNameAndSymbolFlatContract.setDecimalPlaces(18);
    
		SimpleRewardDistributorFlat = await ethers.getContractFactory("SimpleRewardDistributorFlat");
		SimpleRewardDistributorFlatContract = await SimpleRewardDistributorFlat.deploy(TestTokenWithNameAndSymbolFlatContract.address, root);
		await SimpleRewardDistributorFlatContract.deployed();

    await TestTokenWithNameAndSymbolFlatContract.mint(SimpleRewardDistributorFlatContract.address, totalSupply);
	});
  describe("Token Test", async function () {
		it("Balance of contract owner should be 3", async function () {
			let balance = await TestTokenWithNameAndSymbolFlatContract.balanceOf(contractOwner.address);
      balance = ethers.utils.formatEther(balance)
      expect(balance).to.equal('30000.0')
		});
	});
  describe("Claim Test", async function() {
    it("Balance of user1 before claim should be 0", async function() {
      const balance = await TestTokenWithNameAndSymbolFlatContract.balanceOf(users[1].address);
      expect(ethers.utils.formatEther(balance)).to.equal("0.0");
    });
    it("Balance of contract owner after claim should be some value", async function () {
      const index = 1;
      const account = users[1];
      const amount = BigNumber.from("0x100bd33fb98ba00000");
      const leaf = makeLeaf(index, account.address, amount);
      const proof = merkleTree.getHexProof(leaf);
      console.log('proof', proof.length);
      await SimpleRewardDistributorFlatContract.connect(account).claim(index, amount, proof);
      let balance = await TestTokenWithNameAndSymbolFlatContract.balanceOf(account.address);
      balance = ethers.utils.formatEther(balance);
      console.log('balance', balance);
      expect(balance).to.not.equal("0.0");
    })
  });
});