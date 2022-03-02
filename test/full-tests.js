const { expect } = require("chai");

// const { BigNumber, ethers } = require("ethers");
const { network, ethers } = require("hardhat");

// Deploy and create a mock erc721 contract.
// Test end to end auction
describe("Test Start", function () {
	let TestMerkleProof;
	let SimpleRewardDistributorFlat;

	let TestMerkleProofContract;
	let SimpleRewardDistributorFlatContract;

	let contractOwner;
	let user1;
	let user2;
	let user3;
	let user4;

	before(async function () {
		TestMerkleProof = await ethers.getContractFactory("TestMerkleProof");
		// [contractOwner, user1, user2, user3, user4] = await ethers.getSigner();

		TestMerkleProofContract = await TestMerkleProof.deploy();
		await TestMerkleProofContract.deployed();
	});
	describe("Build Merkle Tree", async function () {
		it("Build Merkle Tree with Simple Texts", async function () {
			const sourceString = [
				"string1",
				"string2",
				"string3",
				"string4",
			];
			await TestMerkleProofContract.buildTestMerkleTree(sourceString);
			const merkleTreeRoot = await TestMerkleProofContract.getTestMerkleRoot();
			console.log('merkleTreeRoot=', merkleTreeRoot);
			const totalMerkleTree = await TestMerkleProofContract.getTotalTestMerkleTree();
			console.log('totalMerkleTree=', totalMerkleTree);
		});
		// it("Verify 'error' should returns false", async function () {
		// 	const verifyResult = await TestMerkleProofContract.verifyData(totalMerkleTree, merkleTreeRoot, 'error', 0);
		// 	console.log('verify result for "error"', verifyResult);
		// 	expect(verifyResult).to.equal(false);
		// });
		it("Verify 'string1' should returns true", async function () {
			const verifyResult = await TestMerkleProofContract.verifyData('string2', 1);
			console.log('verify result for "string1"', verifyResult);
			expect(verifyResult).to.equal(true);
		});
		// it("Verify 'string1' should returns true", async function () {
		// 	const verifyResult = await TestMerkleProofContract.verifyData(totalMerkleTree, merkleTreeRoot, 'string1');
		// 	console.log('verify result for "string1"', verifyResult);
		// 	expect(verifyResult).to.equal(true);
		// });
	});
});