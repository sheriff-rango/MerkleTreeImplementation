const { expect } = require("chai");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// const { BigNumber, ethers } = require("ethers");
const { network, ethers } = require("hardhat");

function buildMerkleTree (sourceString) {
	const leafNodes = sourceString.map(string => keccak256(string));
	const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
	return merkleTree;
}

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
	let user5;

	let merkleTree;

	before(async function () {
		console.log('before each')
		TestMerkleProof = await ethers.getContractFactory("TestMerkleProof");
		console.log(111, ethers)
		// [contractOwner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

		TestMerkleProofContract = await TestMerkleProof.deploy();
		await TestMerkleProofContract.deployed();

		const sourceString = [
			"string1",
			"string2",
			"string3",
			"string4",
			"string5"
		];

		merkleTree = buildMerkleTree(sourceString);
		const rootHash = merkleTree.getRoot();
		await TestMerkleProofContract.setMerkleRoot(rootHash);
	});
	describe("Build Merkle Tree", async function () {
		// it("Permission check", async function () {
		// 	const sourceString = [
		// 		"string1",
		// 		"string2",
		// 		"string3",
		// 		"string4",
		// 		"string5"
		// 	];

		// 	const otherMerkleTree = buildMerkleTree(sourceString);
		// 	const rootHash = otherMerkleTree.getRoot();

		// 	await TestMerkleProofContract.connect(user1).setMerkleRoot(rootHash);
		// });
		it("Verify 'error' should return false", async function () {
			const hexProof = merkleTree.getHexProof(keccak256('error'));
			console.log('hexProof\n', hexProof);
			const verifyResult = await TestMerkleProofContract.verifyData(hexProof, 'error');
			expect(verifyResult).to.equal(false);
		});
		it("Verify 'string2' should return true", async function () {
			const hexProof = merkleTree.getHexProof(keccak256('string2'));
			console.log('hexProof\n', hexProof);
			const verifyResult = await TestMerkleProofContract.verifyData(hexProof, 'string2');
			expect(verifyResult).to.equal(true);
		});
	});
});