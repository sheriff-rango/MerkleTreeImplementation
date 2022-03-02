const { network, ethers } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	console.log('deployer', deployer)

	const merkleProof= await deploy("MerkleProof", {
		from: deployer,
		log: true
	});
	const signer = await ethers.signer();
	
};
module.exports.tags = ["all"];
