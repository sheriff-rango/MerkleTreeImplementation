const { expect } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const rewardDistribution = require('./rewardDistributionForTest.json');

function buildMerkleTree (users) {
	const leafNodes = rewardDistribution.distribution.map(distribution => {
    let amount = BigNumber.from(distribution.amount.hex);
    // amount = ethers.utils.formatUnits(amount, 1)
    amount = amount.toString();
    const nodeString = '' + distribution.index + users[distribution.index + 1].address + amount;
    console.log('node string=', nodeString);
    return keccak256(nodeString)
  });
	const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
	return merkleTree;
}

// Deploy and create a mock erc721 contract.
describe("Test Start", function () {
	let SimpleRewardDistributorFlat;
  let TestTokenWithNameAndSymbolFlat;

	let SimpleRewardDistributorFlatContract;
  let TestTokenWithNameAndSymbolFlatContract;

	let contractOwner;
	let users;

	let merkleTree;

	before(async function () {
    users = await ethers.getSigners()
    contractOwner = users[0];

		merkleTree = buildMerkleTree(users);
		const rootHash = merkleTree.getRoot();

    TestTokenWithNameAndSymbolFlat = await ethers.getContractFactory("TestTokenWithNameAndSymbolFlat");
    TestTokenWithNameAndSymbolFlatContract = await TestTokenWithNameAndSymbolFlat.deploy(1e10, "TestToken", "TK");
    await TestTokenWithNameAndSymbolFlatContract.deployed();

    await TestTokenWithNameAndSymbolFlatContract.setDecimalPlaces(5);
    
		SimpleRewardDistributorFlat = await ethers.getContractFactory("SimpleRewardDistributorFlat");
		SimpleRewardDistributorFlatContract = await SimpleRewardDistributorFlat.deploy(TestTokenWithNameAndSymbolFlatContract.address, rootHash);
		await SimpleRewardDistributorFlatContract.deployed();
	});
  describe("Token Test", async function () {
		it("Balance of contract owner should be 1e10", async function () {
			const balance = await TestTokenWithNameAndSymbolFlatContract.balanceOf(contractOwner.address);
      expect(balance.toNumber()).to.equal(1e10)
		});
	});
  describe("Claim Test", async function() {
    it("Balance of user1 before claim should be 0", async function() {
      const balance = await TestTokenWithNameAndSymbolFlatContract.balanceOf(users[1].address);
      expect(balance.toNumber()).to.equal(0);
    });
    it("Balance of user1 after claim should be some value", async function () {
      let amount = BigNumber.from("0x1eca955e9b65e00000");
      // amount = ethers.utils.formatUnits(amount, 1);
      amount = amount.toString()
      console.log('test', amount)
      const nodeString = '0' + users[1].address + amount;
      const hexNode = keccak256(nodeString)
      console.log('test', hexNode)
      const hexProof = merkleTree.getHexProof(hexNode);
      console.log('hexProof length', hexProof.length)
      // const nodeFromContract = await SimpleRewardDistributorFlatContract.getNodeForProof(0, users[1].address, amount);
      // console.log('from contract', nodeFromContract)
      const tx = await SimpleRewardDistributorFlatContract.claim(0, users[1].address, amount, hexProof);
      // await tx.wait();
    })
  });
});


// before(async function () {
  //   users = await ethers.getSigners()
  //   contractOwner = users[0];

  //   const sourceString = [
  //     "string1",
  //     "string2",
  //     "string3",
  //     "string4",
  //     "string5",
  //     "string6",
  //     "string7",
  //   ];
  //   const leafNodes = sourceString.map(string => keccak256(string));
	// 	merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
	// 	const rootHash = merkleTree.getRoot();

  //   TestTokenWithNameAndSymbolFlat = await ethers.getContractFactory("TestTokenWithNameAndSymbolFlat");
  //   TestTokenWithNameAndSymbolFlatContract = await TestTokenWithNameAndSymbolFlat.deploy(1e10, "TestToken", "TK");
  //   await TestTokenWithNameAndSymbolFlatContract.deployed();

  //   await TestTokenWithNameAndSymbolFlatContract.setDecimalPlaces(5);
    
	// 	SimpleRewardDistributorFlat = await ethers.getContractFactory("SimpleRewardDistributorFlat");
	// 	SimpleRewardDistributorFlatContract = await SimpleRewardDistributorFlat.deploy(TestTokenWithNameAndSymbolFlatContract.address, rootHash);
	// 	await SimpleRewardDistributorFlatContract.deployed();
	// });
  // describe("Test", async function () {
  //   it("test", async function () {
  //     const hexProof = merkleTree.getHexProof(keccak256('stringjhug2'));
  //     const verifyResult = await SimpleRewardDistributorFlatContract.verifyData(hexProof, keccak256('string2'));
  //     console.log(verifyResult)
  //   })
  // })