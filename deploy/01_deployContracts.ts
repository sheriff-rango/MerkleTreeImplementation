import { HardhatRuntimeEnvironment } from "hardhat/types";
const { network, ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const { BigNumber } = require("ethers");

const rewardDistribution = require("../rewardDistribution.json");

function makeLeaf(index: number, address: string, amount: string) {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(
        ["uint256", "address", "uint256"],
        [index, address, amount]
      )
      .slice(2),
    "hex"
  );
}

function makeLeaves() {
  return rewardDistribution.distribution.map((distribution: any) => {
    let amount = BigNumber.from(distribution.amount.hex);
    amount = amount.toString();
    const address = distribution.address;
    return makeLeaf(distribution.index, address, amount);
  });
}

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("start deploying! deployer", deployer);

  const leaves = makeLeaves();
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const rootHash = merkleTree.getHexRoot(0);
  const totalSupply = ethers.utils.parseEther("30000");

  const testTokenWithNameSymbolFlat = await deploy(
    "TestTokenWithNameAndSymbolFlat",
    {
      from: deployer,
      log: true,
      args: ["TestToken", "TK"],
    }
  );

  const simpleRewardDistributorFlat = await deploy(
    "SimpleRewardDistributorFlat",
    {
      from: deployer,
      log: true,
      args: [testTokenWithNameSymbolFlat.address, rootHash],
    }
  );

  const signer = await ethers.getSigner();
  const testTokenWithNameSymbolFlatContract = new ethers.Contract(
    testTokenWithNameSymbolFlat.address,
    testTokenWithNameSymbolFlat.abi,
    signer
  );
  await testTokenWithNameSymbolFlatContract.mint(
    simpleRewardDistributorFlat.address,
    totalSupply
  );

  // verify token contract
  try {
    await hre.run("verify:verify", {
      address: testTokenWithNameSymbolFlat.address,
      constructorArguments: ["TestToken", "TK"],
    });
  } catch (err) {
    console.error(err);
  }

  // verify reward contracts
  try {
    await hre.run("verify:verify", {
      address: simpleRewardDistributorFlat.address,
      constructorArguments: [testTokenWithNameSymbolFlat.address, rootHash],
    });
  } catch (err) {
    console.error(err);
  }
};
module.exports.tags = ["all"];
