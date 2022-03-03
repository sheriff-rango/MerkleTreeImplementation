const { expect } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");

const rewardDistribution = require('./rewardDistributionForTest.json');

function makeLeaves (users) {
  return rewardDistribution.distribution.map(distribution => {
    let amount = BigNumber.from(distribution.amount.hex);
    amount = amount.toString();
    amount = 1000 * (distribution.index + 1);
    const nodeString = '' + distribution.index + users[distribution.index].address + amount;
    // console.log('node string=', nodeString);
    return keccak256(nodeString)
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
    users = await ethers.getSigners()
    contractOwner = users[0];

    leaves = makeLeaves(users);

		merkleTree = new MerkleTree(leaves, keccak256, {sort: true});
		const rootHash = merkleTree.getRoot();
    root = rootHash;
    console.log('test root', rootHash)

    TestTokenWithNameAndSymbolFlat = await ethers.getContractFactory("TestTokenWithNameAndSymbolFlat");
    TestTokenWithNameAndSymbolFlatContract = await TestTokenWithNameAndSymbolFlat.deploy(1e10, "TestToken", "TK");
    await TestTokenWithNameAndSymbolFlatContract.deployed();

    await TestTokenWithNameAndSymbolFlatContract.setDecimalPlaces(5);
    
		SimpleRewardDistributorFlat = await ethers.getContractFactory("SimpleRewardDistributorFlat");
		SimpleRewardDistributorFlatContract = await SimpleRewardDistributorFlat.deploy(TestTokenWithNameAndSymbolFlatContract.address, rootHash);
		await SimpleRewardDistributorFlatContract.deployed();

    const contractMerkleRoot = await SimpleRewardDistributorFlatContract.getMerkleRoot();
    console.log('contract root', contractMerkleRoot)
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
      amount = 1000;
      const nodeString = '0' + users[0].address + amount.toString();
      // const hexNode = keccak256(nodeString)
      console.log('test', nodeString)
      
      let abiEncodePackedString = ethers.utils.solidityPack(['string'], [nodeString]);
      console.log(nodeString, '->', abiEncodePackedString);
      
      const otherHexNodes = web3.utils.soliditySha3({type: 'string', value: abiEncodePackedString});
      console.log('otherHexNodes', otherHexNodes)
      // let otherHexNode = ethers.utils.solidityKeccak256(['string'], [abiEncodePackedString]);
      // console.log('test', 1, otherHexNode);
      // otherHexNode = ethers.utils.soliditySha256(['string'], [abiEncodePackedString]);
      // console.log('test', 2, otherHexNode);
      // otherHexNode = ethers.utils.keccak256(abiEncodePackedString)
      // console.log('test', 3, otherHexNode);
      // otherHexNode = ethers.utils.sha256(abiEncodePackedString)
      // console.log('test', 4, otherHexNode);

      // const proof = merkleTree.getHexProof(hexNode);
      const proof = merkleTree.getProof(leaves[0]).map(x => x.data);
      console.log('hexProof length', proof.length)

      console.log('test verify', merkleTree.verify(proof, leaves[0], root, keccak256));

      const nodeFromContract = await SimpleRewardDistributorFlatContract.getNodeForProof(0, 1000, proof);
      console.log('from contract', nodeFromContract)
      // const tx = await SimpleRewardDistributorFlatContract.claim(0, users[1].address, amount, hexProof);
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